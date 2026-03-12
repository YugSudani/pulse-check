import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("session_id");
  const [isVisible, setIsVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const downloadReceipt = async () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Dark background matching theme (#0D121C)
      doc.setFillColor(13, 18, 28);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      
      // Green accent bar at top
      doc.setFillColor(34, 197, 94);
      doc.rect(0, 0, pageWidth, 4, "F");
      
      // Header section with checkmark
      doc.setTextColor(34, 197, 94);
      doc.setFontSize(48);
      doc.text("✓", 25, 30);
      
      // Main heading
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont(undefined, "bold");
      doc.text("Payment Successful", 50, 32);
      
      // Subheading
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      doc.setTextColor(156, 163, 175);
      doc.text("Your subscription is now active", 50, 42);
      
      // Divider line (gray)
      doc.setDrawColor(55, 65, 81);
      doc.setLineWidth(0.5);
      doc.line(20, 55, pageWidth - 20, 55);
      
      // Receipt Details Box
      doc.setFillColor(18, 26, 40);
      doc.rect(20, 65, pageWidth - 40, 70, "F");
      
      // Box border
      doc.setDrawColor(75, 85, 99);
      doc.setLineWidth(0.3);
      doc.rect(20, 65, pageWidth - 40, 70);
      
      // Section title
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.setTextColor(34, 197, 94);
      doc.text("RECEIPT DETAILS", 28, 76);
      
      // Detail rows
      doc.setFontSize(9);
      const detailsStartY = 88;
      const rowHeight = 13;
      const labelX = 28;
      const valueX = pageWidth / 2 + 5;
      
      const receiptData = [
        ["Session ID", sessionId ? sessionId.substring(0, 35) : "N/A"],
        ["Status", "Confirmed"],
        ["Date & Time", new Date().toLocaleString()],
        ["Plan Type", "Premium Subscription"],
      ];
      
      receiptData.forEach((row, index) => {
        const y = detailsStartY + index * rowHeight;
        
        // Label
        doc.setTextColor(156, 163, 175);
        doc.setFont(undefined, "bold");
        doc.text(row[0], labelX, y);
        
        // Value
        doc.setTextColor(229, 231, 235);
        doc.setFont(undefined, "normal");
        
        // Wrap text if too long
        if (row[0] === "Session ID" && row[1].length > 30) {
          doc.text(row[1].substring(0, 32), valueX, y);
        } else {
          doc.text(row[1], valueX, y);
        }
      });
      
      // What's Included section
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("What's Included", 28, 155);
      
      // Features with green bullets
      const features = [
        "Full access to premium monitoring features",
        "Priority email & push notifications",
        "Advanced analytics and reporting",
        "Secure data encryption & compliance",
      ];
      
      let featureY = 168;
      doc.setFontSize(9);
      doc.setFont(undefined, "normal");
      doc.setTextColor(209, 213, 219);
      
      features.forEach((feature) => {
        doc.setTextColor(34, 197, 94);
        doc.text("●", 28, featureY);
        doc.setTextColor(209, 213, 219);
        doc.text(feature, 35, featureY);
        featureY += 10;
      });
      
      // Important notice box
      doc.setFillColor(18, 26, 40);
      doc.rect(20, featureY + 5, pageWidth - 40, 22, "F");
      
      // Green border for notice
      doc.setDrawColor(34, 197, 94);
      doc.setLineWidth(1);
      doc.rect(20, featureY + 5, pageWidth - 40, 22);
      
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.setTextColor(34, 197, 94);
      doc.text("✓ Confirmation Email Sent", 28, featureY + 13);
      
      doc.setFont(undefined, "normal");
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(
        "A confirmation email with your login credentials has been sent to your inbox.",
        28,
        featureY + 19,
        { maxWidth: pageWidth - 56 }
      );
      
      // Footer section
      const footerY = pageHeight - 25;
      doc.setDrawColor(55, 65, 81);
      doc.setLineWidth(0.3);
      doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
      
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.setFont(undefined, "normal");
      doc.text(
        "Thank you for choosing our service. We're excited to have you on board!",
        pageWidth / 2,
        footerY,
        { align: "center" }
      );
      
      // Receipt ID and timestamp at bottom
      doc.setFontSize(7);
      doc.setTextColor(75, 85, 99);
      const receiptIdShort = sessionId ? sessionId.substring(0, 25) + "..." : "N/A";
      doc.text(`Receipt ID: ${receiptIdShort}`, 20, pageHeight - 8);
      doc.text(new Date().toLocaleString(), pageWidth - 20, pageHeight - 8, { align: "right" });
      
      // Download the PDF
      doc.save(`payment-receipt-${sessionId ? sessionId.substring(0, 15) : "receipt"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download receipt. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      fontFamily: "'Geist', 'Segoe UI', sans-serif"
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full opacity-20" style={{
          background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "float 8s ease-in-out infinite"
        }}></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15" style={{
          background: "radial-gradient(circle, #34d399 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "float 10s ease-in-out infinite 1s"
        }}></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 50;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-scale-in {
          animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .checkmark-path {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: checkmark 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
          animation-delay: 0.3s;
        }
      `}</style>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className={`w-full max-w-md transition-all duration-500 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          
          {/* Checkmark circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full animate-scale-in" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" stroke="#10b981" strokeWidth="2" opacity="0.2" />
                <circle cx="50" cy="50" r="45" stroke="#10b981" strokeWidth="3" />
                <path
                  d="M 30 50 L 44 64 L 70 36"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="checkmark-path"
                />
              </svg>
            </div>
          </div>

          {/* Content card */}
          <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl p-8 sm:p-10 shadow-2xl" style={{
            animationDelay: "0.2s"
          }}>
            
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-white animate-slide-up" style={{
              animationDelay: "0.4s"
            }}>
              Payment Successful
            </h1>

            {/* Subheading */}
            <p className="text-center text-slate-300 text-sm mb-8 animate-slide-up" style={{
              animationDelay: "0.5s"
            }}>
              Your subscription is being activated
            </p>

            {/* Session ID card */}
            <div className="bg-white/[0.05] border border-white/[0.1] rounded-xl p-4 mb-8 animate-slide-up" style={{
              animationDelay: "0.6s"
            }}>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Session ID
              </p>
              <p className="text-sm font-mono text-emerald-300 break-all select-all hover:text-emerald-200 transition-colors">
                {sessionId || "Processing..."}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="space-y-3 mb-8 animate-slide-up" style={{
              animationDelay: "0.7s"
            }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-sm text-slate-300">Payment confirmed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span className="text-sm text-slate-300">Plan activating</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                <span className="text-sm text-slate-400">Redirecting</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 animate-slide-up" style={{
              animationDelay: "0.8s"
            }}>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-emerald-500/25"
              >
                Go to Dashboard
              </button>
              <button
                onClick={downloadReceipt}
                disabled={isDownloading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-500 disabled:to-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v4a2 2 0 002 2h12a2 2 0 002-2v-4m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Receipt
                  </>
                )}
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-white/[0.1] hover:bg-white/[0.15] text-slate-200 font-medium py-3 px-6 rounded-lg transition-all duration-200 border border-white/[0.2] hover:border-white/[0.3]"
              >
                Back to Home
              </button>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-slate-500 text-xs mt-8 animate-slide-up" style={{
            animationDelay: "0.9s"
          }}>
            A confirmation email has been sent to your inbox
          </p>
        </div>
      </div>
    </div>
  );
}