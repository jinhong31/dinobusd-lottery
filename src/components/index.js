import { useCallback, useEffect, useState } from "react";
import web3ModalSetup from "./../helpers/web3ModalSetup";
import Web3 from "web3";
import getAbi from "../Abi";
import getAbiBusd from "../Abi/busd";
import logo from "./../assets/logo.png";
import audit from "./../assets/audit.png";



/* eslint-disable no-unused-vars */
const web3Modal = web3ModalSetup();

const Interface = () => {
  const [Abi, setAbi] = useState();
  const [AbiBusd, setAbiBusd] = useState();
  const [web3, setWeb3] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [injectedProvider, setInjectedProvider] = useState();
  const [refetch, setRefetch] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [current, setCurrent] = useState(null);
  const [connButtonText, setConnButtonText] = useState("CONNECT");
  const [tickets, setTicket] = useState(0);
  const [tickets1, setTicket1] = useState(0);
  const [tickets2, setTicket2] = useState(0);
  const [length, setLength] = useState(0);
  const [length2, setLength2] = useState(0);
  const [length3, setLength3] = useState(0);
  const [price, setPrice] = useState(0);
  const [price1, setPrice1] = useState(0);
  const [price2, setPrice2] = useState(0);
  const [spot, setSpot] = useState(0);
  const [spot2, setSpot1] = useState(0);
  const [spot3, setSpot2] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [balance, setBalance] = useState(0);





  const [pendingMessage, setPendingMessage] = useState('');



  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (
      injectedProvider &&
      injectedProvider.provider &&
      typeof injectedProvider.provider.disconnect == "function"
    ) {
      await injectedProvider.provider.disconnect();
    }
    setIsConnected(false);

    window.location.reload();
  };
  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3(provider));
    const acc = provider.selectedAddress
      ? provider.selectedAddress
      : provider.accounts[0];


    const short = shortenAddr(acc);

    setWeb3(new Web3(provider));
    setAbi(await getAbi(new Web3(provider)));
    setAbiBusd(await getAbiBusd(new Web3(provider)));
    setAccounts([acc]);
    setCurrent(acc);
    //     setShorttened(short);
    setIsConnected(true);

    setConnButtonText(short);

    provider.on("chainChanged", (chainId) => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new Web3(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new Web3(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    setInterval(() => {
      setRefetch((prevRefetch) => {
        return !prevRefetch;
      });
    }, 2000);
  }, []);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
    // eslint-disable-next-line
  }, []);

  const shortenAddr = (addr) => {
    if (!addr) return "";
    const first = addr.substr(0, 3);
    const last = addr.substr(38, 41);
    return first + "..." + last;
  };





  useEffect(() => {
    const Contract = async () => {
      if (isConnected && Abi) {
        let _lotteryOneTickets = await Abi.methods.viewTicket().call();
        let _lotteryTwoTickets = await Abi.methods.viewTicket1().call();
        let _lotteryThreeTickets = await Abi.methods.viewTicket2().call();

        setTicket(_lotteryOneTickets);
        setTicket1(_lotteryTwoTickets);
        setTicket2(_lotteryThreeTickets);


        let _length1 = await Abi.methods.getLotteryLength().call();
        let _length2 = await Abi.methods.getLottery1Length().call();
        let _length3 = await Abi.methods.getLottery2Length().call();

        setLength(_length1);
        setLength2(_length2);
        setLength3(_length3);


        let _price = await Abi.methods.viewTicketPrice().call();
        let _price1 = await Abi.methods.viewTicketPrice1().call();
        let _price2 = await Abi.methods.viewTicketPrice2().call();

        setPrice(_price / 10e17);
        setPrice1(_price1 / 10e17);
        setPrice2(_price2 / 10e17);

        let _spot = await Abi.methods.howMany(current).call();
        setSpot(_spot[0]);
        setSpot1(_spot[1]);
        setSpot2(_spot[2]);




      }
    };

    Contract();
    // eslint-disable-next-line
  }, [refetch]);

  useEffect(() => {
    const Allowance = async () => {
      if (isConnected && AbiBusd) {
        let _contract = '0xB5CaAE09f56C27BeC46E85f59a6B3D52caa0c015';
        let allow = await AbiBusd.methods.allowance(current, _contract).call();
        setAllowance(allow);


        let _balance = await AbiBusd.methods.balanceOf(current).call();
        setBalance(_balance / 10e17);
      }
    }
    Allowance();
    // eslint-disable-next-line
  }, [refetch]);






  // buttons

  const Approve = async (e) => {
    e.preventDefault();
    if (isConnected && AbiBusd) {
      setPendingMessage("Approving BUSD");
      let _contract = '0xB5CaAE09f56C27BeC46E85f59a6B3D52caa0c015';
      let _amount = '99999999999999999999999999999999999999999999999999';
      await AbiBusd.methods.approve(_contract, _amount).send({
        from: current,
      });
      setPendingMessage("Successfully Approved");
    }
    else {
      console.log("connect wallet");
    }
  }

  const JoinLottery = async (e) => {
    e.preventDefault();
    if (isConnected && Abi) {
      setPendingMessage("Joining Silver Lottery");
      let _value = web3.utils.toWei('5');

      await Abi.methods.joinLottery(_value).send({
        from: current,
      });
      setPendingMessage("Successfully Joined");
    }
    else {
      console.log("Connect Wallet");
    }
  }

  const JoinLottery1 = async (e) => {
    e.preventDefault();
    if (isConnected && Abi) {
      setPendingMessage("Joining Gold Lottery");
      let _value = web3.utils.toWei('10');
      await Abi.methods.joinLottery1(_value).send({
        from: current,
      });
      setPendingMessage("Successfully Joined");
    }
    else {
      console.log("Connect Wallet");
    }
  }

  const JoinLottery2 = async (e) => {
    e.preventDefault();
    if (isConnected && Abi) {
      setPendingMessage("Joining Diamond Lottery");
      let _value = web3.utils.toWei('50');
      await Abi.methods.joinLottery2(_value).send({
        from: current,
      });
      setPendingMessage("Successfully Joined");
    }
    else {
      console.log("Connect Wallet");
    }
  }

  const closeBar = async (e) => {
    e.preventDefault();
    setPendingMessage('');
  }




  return (
    <>

      <nav className="navbar navbar-expand-sm navbar-dark" style={{ background: "black" }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="https://dinobusd.finance"><img src={logo} alt="logo" className="img-fluid" style={{ width: "200px" }} /></a>

          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <a className="nav-link" href="whitepaper.pdf">WHITEPAPER</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="audit.pdf">AUDIT</a>
            </li>
          </ul>

          <a href="https://dinobusd.finance" className="btn btn-primary btn-lg btnd" style={{ background: "black", color: "#f68f19", border: "1px solid #fff" }}>MINER APP</a>

          <button className="btn btn-primary btn-lg btnd" style={{ background: "#f68f19", color: "black", border: "1px solid #fff" }} onClick={loadWeb3Modal}><span className="fas fa-wallet"></span> {connButtonText}</button>



        </div>
      </nav>
      <br />
      <div className="container">
        <div className="row">
          <div className="col-sm-9">
            <h1>Dino Lottery</h1>
            <p>Instant Win, Instant Annoncement, Immediate Transfer</p>
          </div>

          <div className="col-sm-3">
            <h1>Your Balance</h1>
            <p>{Number(balance).toFixed(2)} BUSD</p>
          </div>
        </div>

      </div>
      <br /> <div className="container">

        {pendingMessage !== '' ?
          <>
            <center><div className="alert alert-warning alert-dismissible">
              <p onClick={closeBar} className="badge bg-dark" style={{ float: "right", cursor: "pointer" }}>X</p>
              {pendingMessage}</div></center>
          </> :

          <></>
        }
        <div className="row">
          <div className="col-sm-4">
            <div className="card">
              <div className="card-body"> <center> <h4>Winning Prize <br /> 30 BUSD</h4>
                <p style={{ fontSize: "8px" }}>30% tax to ROI Contract</p></center>
              </div> </div>
          </div>
          <div className="col-sm-4">
            <div className="card">
              <div className="card-body"> <center> <h4>Winning Prize <br /> 50 BUSD</h4>
                <p style={{ fontSize: "8px" }}>30% tax to ROI Contract</p></center>
              </div> </div>
          </div>
          <div className="col-sm-4">
            <div className="card">
              <div className="card-body"> <center> <h4>Winning Prize <br /> 200 BUSD</h4>
                <p style={{ fontSize: "8px" }}>30% tax to ROI Contract</p></center>
              </div> </div>
          </div>
        </div>
        <br />
        <div className="row">


          <div className="col-sm-4">
            <div className="card">

              <div className="card-header">
                Silver Lottery
              </div>
              <div className="card-body">

                <table className="table">
                  <tbody>
                    <tr>
                      <td>Entry Fee</td>
                      <td style={{ textAlign: "right" }}>{price} BUSD</td>
                    </tr>

                    <tr>
                      <td>Max Participants</td>
                      <td style={{ textAlign: "right" }}>{tickets}</td>
                    </tr>

                    <tr>
                      <td>Participated</td>
                      <td style={{ textAlign: "right" }}>{length}</td>
                    </tr>

                    <tr>
                      <td>Open Slots</td>
                      <td style={{ textAlign: "right" }}>{tickets - length}</td>
                    </tr>

                    <tr>
                      <td>Your Entries</td>
                      <td style={{ textAlign: "right" }}>{spot}</td>
                    </tr>




                  </tbody>
                </table>

                <center>

                  {allowance > 0 ?

                    <>
                      <button className="btn btn-danger btn-lg" onClick={JoinLottery}>Participate</button>

                    </>

                    :

                    <>
                      <button className="btn btn-success btn-lg" onClick={Approve}>Approve</button>
                    </>

                  }
                </center>  </div>

            </div>

          </div>


          <div className="col-sm-4">
            <div className="card">
              <div className="card-header">
                Gold Lottery
              </div>
              <div className="card-body">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>Entry Fee</td>
                      <td style={{ textAlign: "right" }}>{price1} BUSD</td>
                    </tr>

                    <tr>
                      <td>Max Participants</td>
                      <td style={{ textAlign: "right" }}>{tickets1}</td>
                    </tr>

                    <tr>
                      <td>Participated</td>
                      <td style={{ textAlign: "right" }}>{length2}</td>
                    </tr>

                    <tr>
                      <td>Open Slots</td>
                      <td style={{ textAlign: "right" }}>{tickets1 - length2}</td>
                    </tr>

                    <tr>
                      <td>Your Entries</td>
                      <td style={{ textAlign: "right" }}>{spot2}</td>
                    </tr>




                  </tbody>
                </table>

                <center>
                  {allowance > 0 ?

                    <>
                      <button className="btn btn-danger btn-lg" onClick={JoinLottery1}>Participate</button>

                    </>

                    :

                    <>
                      <button className="btn btn-success btn-lg" onClick={Approve}>Approve</button>
                    </>

                  }
                </center>
              </div>

            </div>

          </div>

          <div className="col-sm-4">
            <div className="card">
              <div className="card-header">
                Diamond Lottery
              </div>
              <div className="card-body">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>Entry Fee</td>
                      <td style={{ textAlign: "right" }}>{price2} BUSD</td>
                    </tr>

                    <tr>
                      <td>Max Participants</td>
                      <td style={{ textAlign: "right" }}>{tickets2}</td>
                    </tr>

                    <tr>
                      <td>Participated</td>
                      <td style={{ textAlign: "right" }}>{length3}</td>
                    </tr>

                    <tr>
                      <td>Open Slots</td>
                      <td style={{ textAlign: "right" }}>{tickets2 - length3}</td>
                    </tr>

                    <tr>
                      <td>Your Entries</td>
                      <td style={{ textAlign: "right" }}>{spot3}</td>
                    </tr>




                  </tbody>
                </table>

                <center>

                  {allowance > 0 ?

                    <>
                      <button className="btn btn-danger btn-lg" onClick={JoinLottery2}>Participate</button>

                    </>

                    :

                    <>
                      <button className="btn btn-success btn-lg" onClick={Approve}>Approve</button>
                    </>

                  }
                </center>
              </div>

            </div>

          </div>
        </div>
      </div>
      <br /><center>
        <h2>Audit Partner</h2>
        <a href="audit.pdf"><img src={audit} alt={audit} className="img-fluid" style={{ width: "300px" }} /></a>
      </center>
      <br />
      <center> <h4>To check Winners Please Reffer To Lottery Smart Contract </h4></center>


      <br />
      <center><h5> <a href="https://twitter.com/dinobusd" style={{ color: "#f68f19", textDecoration: "none" }}><i class="fa fa-twitter"></i> Twitter </a> || <a href="https://t.me/DinoBusdOfficial" style={{ color: "#f68f19", textDecoration: "none" }}><i class="fa fa-telegram"></i> Telegram </a> || <a href="audit.pdf" style={{ color: "#f68f19", textDecoration: "none" }}><i class="fa fa-file-code-o"></i> Audit </a>|| <a href="https://bscscan.com/address/0xB5CaAE09f56C27BeC46E85f59a6B3D52caa0c015#code" style={{ color: "#f68f19", textDecoration: "none" }}><i class="fa fa-line-chart"></i> Bscscan </a></h5></center>
      <br />



    </>

  );
}

export default Interface;
