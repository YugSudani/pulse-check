const axios = require("axios");

const pingIt = async (monitor) => {
    let status;
          let statusCode = 500;
          let responseTime = null;
    
          const startTime = Date.now();
    
          try {
            const response = await axios.head(monitor.url, { timeout: 3000 });
            // console.log(new Date().toLocaleTimeString());
            responseTime = Date.now() - startTime;
            statusCode = response.status;
            // console.log("time : " + responseTime + " | code : " + statusCode);
    
            status = statusCode >= 200 && statusCode < 400 ? "UP" : "DOWN";
    
            // console.log(monitor.url, " -> ", status);
          } catch (err) {
            responseTime = Date.now() - startTime;
    
            if (err.code === "ECONNABORTED") status = "TIME-OUT";
            else if (err.code === "ENOTFOUND") status = "DNS-ERROR";
            else status = "NETWORK-ERROR";
            // console.log(monitor.url, " -> ", status);
          }   
          return {status,statusCode,responseTime};
}

module.exports = pingIt;