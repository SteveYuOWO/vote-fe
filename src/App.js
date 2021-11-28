import "./App.css";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { signOut } from "./utils";
import NEAR from "./assets/logo-white.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./components/Loading";
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import SwiperCore, {
  Pagination
} from 'swiper';
import Bozzi from "./assets/character/Bozzi.png";
import Kage from "./assets/character/Kage.png";
import Daida from "./assets/character/Daida.png";
import Hilling from "./assets/character/Hilling.png";
import Domas from "./assets/character/Domas.png";
import Bebin from "./assets/character/Bebin.png";
import "swiper/swiper.min.css";
import 'swiper/modules/navigation/navigation.min.css'; // Navigation module
import 'swiper/modules/pagination/pagination.min.css'; // Pagination module

const images = [Bozzi, Kage, Daida, Hilling, Domas, Bebin];

SwiperCore.use([Pagination]);

function App({ contract, currentUser, nearConfig, wallet }) {
  const [round, setRound] = useState(0);
  const [accountId, setAccountId] = useState("");
  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState(-1);
  const [candidates, setCandidates] = useState([]);
  const [inputCandidates, setInputCandidates] = useState('');
  const [lastWinner, setLastWinner] = useState('None');

  const fetchCandidates = async () => {
    setLoading(true);
    setTimeout(async () => {
      const candidates = await contract.get_candidates()
      const candidatesArray = []
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        const score = await contract.get_score({ candidate })
        candidatesArray.push({ name: candidate, score })
      }
      setCandidates(candidatesArray)
      const round = await contract.get_round();
      setRound(round);
      const lastWinner = await contract.last_winner();
      // console.log(lastWinner);
      setLastWinner(lastWinner);
      setLoading(false);
    }, 500)
  }
  useEffect(() => {
    if (currentUser) {
      fetchCandidates();
      setAccountId(currentUser.accountId);
    }
  }, []);

  if (!currentUser) {
    return (
      <div>
        <Login wallet={wallet} nearConfig={nearConfig} />
      </div>
    );
  }

  return (
    <>
      {loading && <Loading />}
      <main className={loading ? "blur" : ""}>
        <div className="near-icon">
          <img src={NEAR} width="100px" height="100px" alt="NEAR" />
        </div>
        <h1>Ranking of Near Kings<strong>( Round: {round} )</strong></h1>
        <h3 style={{ marginTop: '20px' }}>Last round winner: <strong>{lastWinner[0]}</strong> Score: <strong>{lastWinner[1]}</strong></h3>
        <div className="nav">
          <h3>Login as {accountId}</h3>
          <button onClick={() => signOut({ wallet })}>Logout</button>
          <button onClick={async () => {
            setLoading(true);
            try {
              const [candidates, score] = await contract.next_round();
              await fetchCandidates();
              
              setTimeout(() => {
                toast.success(`${candidates} success, score ${score}! `)
              }, 500)
            }catch (err) {
              toast.error(`Network not stable. Try again`)

            }
          }}>Next Round</button>
        </div>
        <div
          className="swiperr">
          {candidates.length !== 0 && <Swiper
            style={{ width: "450px", paddingBottom: "40px", paddingTop: "40px" }}
            pagination
            spaceBetween={20}
            slidesPerView={3}
            // onSlideChange={(e) => console.log(e)}
          // onSwiper={(swiper) => console.log(swiper)}
          >
            {candidates.map((candidate, index) => (
              <SwiperSlide key={index}>
                <div className={select === index ? "selected" : "noselect"} onClick={() => setSelect(index)}>
                  <img src={images[index % images.length]} width="auto" height="200px" alt="" />
                  <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {candidate.name}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    vote score: {candidate.score}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>}
          {candidates.length === 0 && <div style={{ marginBottom: '10px' }}>No Candidates, Please add one.</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Click image to select and vote</p>
          <button
            style={{ margin: 0, marginLeft: 20 }}
            onClick={() => {
              setLoading(true);
              // console.log(candidates[select].name)
              contract.vote({ candidate: candidates[select].name }).then((res) => {
                // console.log(res)
                setLoading(false);
                if (res) {
                  fetchCandidates().then(() => {
                    setTimeout(() => {
                      toast.success("Vote success!");
                    }, 1000)
                  })
                } else {
                  setTimeout(() => {
                    toast.error("Vote failed! You have voted before");
                  }, 300)
                }
              }).catch(() => {
                setLoading(false);
                setTimeout(() => {
                  toast.error("Vote failed! You have voted before");
                }, 1000)
              })
            }}>Vote</button>
        </div>
        <div className="potential-input">
          <input type="text" placeholder="Please input the potential candidates" onChange={(e) => {
            setInputCandidates(e.target.value)
          }} />
          <button style={{ marginLeft: '10px' }} onClick={async () => {
            setLoading(true);
            contract.add_candidate({ candidate: inputCandidates }).then(async () => {
              await fetchCandidates();
              setTimeout(() => {
                toast.success('Add potential candidates success');
              }, 1000);
            }).catch(() => {
              setLoading(false)
              setTimeout(() => {
                toast.error('Add potential candidates error');
              }, 1000);
            })
          }}>Submit</button>
        </div>
        <ToastContainer />
      </main>
    </>
  );
}

export default App;
