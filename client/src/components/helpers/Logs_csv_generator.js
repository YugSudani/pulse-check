const exportLogs = (incidents,monitor) => {
    if (!incidents.length) {
        alert("No incidents to export");
        return;
    }

    const headers = [
        "Root Cause",
        "Started",
        "Resolved",
        "Duration (seconds)",
    ];

    const rows = incidents.map((item) => [
        item.incidentType,
        new Date(item.incidentStartTime)
            .toLocaleString("en-GB")
            .replace(",", ""),
        item.incidentEndTime
            ? new Date(item.incidentEndTime)
                .toLocaleString("en-GB")
                .replace(",", "")
            : "Ongoing",
        Math.floor((item.incidentDuration || 0) / 1000),
    ]);

    const csvContent =
        [headers, ...rows]
            .map(row =>
                row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
            )
            .join("\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${monitor?.name || "monitor"}-incidents.csv`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export default exportLogs;
