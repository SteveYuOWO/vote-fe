import React from "react";
import "./login.css";
import Bozzi from "../assets/character/Bozzi.png";
import Daida from "../assets/character/Daida.png";
import Kage from "../assets/character/Kage.png";
import { signIn } from "../utils";

const Login = ({ wallet, nearConfig }) => {
  return (
    <main>
      <div className="profile">
        <img src={Kage} width="auto" height="300px" alt="STEVE" />
        <img src={Bozzi} width="auto" height="300px" alt="STEVE" />
        <img src={Daida} width="auto" height="300px" alt="NEAR" />
      </div>
      <h1 className="gray">Ranking of Near Kings</h1>
      <p className="content">
        <strong>
          <font className="coral">Thanks for watching my portfolio</font>
        </strong>
        , Ranking of Near Kings are designed for the{" "}
        <strong>NEAR Challenge</strong>. <br />
        <strong>Ranking of Kings</strong>, the number of powerful people, and
        whether the king himself is as powerful as the brave is the{" "}
        <strong>
          "king ranking" (
          <a
            style={{ color: "blue" }}
            href="https://en.wikipedia.org/wiki/Ranking_of_Kings"
          >
            {" "}
            adapted from wiki{" "}
          </a>
          )
        </strong>
        . The main character,{" "}
        <strong>
          <font className="coral">Bozzi</font>
        </strong>
        , is the first prince of the kingdom ruled by King Bose, who is ranked
        7th in the kingdom. However,{" "}
        <strong>
          <font className="coral">Bozzi</font>
        </strong>{" "}
        was born deaf and too weak to lift a sword, and not only his courtiers
        but also the people scorned him as "not king material". Such{" "}
        <strong>
          <font className="coral">Bozzi</font>
        </strong>{" "}
        made his first friend, <strong>Kage</strong>. With the encounter with{" "}
        <strong>Kage</strong>, and a little courage,{" "}
        <strong>
          <font className="coral">Bozzi</font>
        </strong>
        's life took a big step forward. Use your near citizenship to vote for{" "}
        <strong>
          <font className="coral">the king ranking of your choice</font>
        </strong>
      </p>
      <button onClick={() => signIn({ wallet, nearConfig })}>Login</button>
    </main>
  );
};

export default Login;
