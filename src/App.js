import "./App.css";
import styled from "styled-components";
import { useEffect, useState } from "react";

const BIRD_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 5;
const JUMP_HEIGHT = 100;
const OBSTACLE_WITDH = 40;
const OBSTACLE_GAP = 150;

function App() {
  const [birdPosition, SetBirdPosition] = useState(250);
  const [gameHasStarted, SetGameHasStarted] = useState(false);
  const [obstacleHeight, SetObstacleHeight] = useState(200);
  const [obstacleLeft, SetObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WITDH);
  const [score, setScore] = useState(0);

  const bottomObstacleheight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  useEffect(() => {
    let timeId;
    if (gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
      timeId = setInterval(() => {
        SetBirdPosition((birdPosition) => birdPosition + GRAVITY);
      }, 24);
    }

    return () => {
      clearInterval(timeId);
    };
  }, [birdPosition, gameHasStarted]);

  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WITDH) {
      obstacleId = setInterval(() => {
        SetObstacleLeft((obstacleLeft) => obstacleLeft - 5);
      }, 24);
      return () => {
        clearInterval(obstacleId);
      };
    } else {
      SetObstacleLeft(GAME_WIDTH - OBSTACLE_WITDH);
      SetObstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
      );
      if (gameHasStarted) setScore((score) => score + 1);
    }
  }, [gameHasStarted, obstacleLeft]);

  useEffect(() => {
    const hasCallidedWithTopObstacle =
      birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCallidedWithBottomObstacle =
      birdPosition <= 500 && birdPosition >= 500 - bottomObstacleheight;

    if (
      obstacleLeft >= 0 &&
      obstacleLeft <= OBSTACLE_WITDH &&
      (hasCallidedWithTopObstacle || hasCallidedWithBottomObstacle)
    ) {
      SetGameHasStarted(false);
      setScore(0);
      SetBirdPosition(250);
    }
  }, [obstacleHeight, bottomObstacleheight, obstacleLeft]);

  const handleClick = () => {
    let newBirdPostion = birdPosition - JUMP_HEIGHT;
    if (!gameHasStarted) {
      SetGameHasStarted(true);
    } else if (newBirdPostion < 0) {
      SetBirdPosition(0);
    } else {
      SetBirdPosition(newBirdPostion);
    }
  };

  return (
    <Div onClick={handleClick}>
      <GameBox width={GAME_WIDTH} height={GAME_HEIGHT}>
        <Obstacle
          width={OBSTACLE_WITDH}
          height={obstacleHeight}
          left={obstacleLeft}
          top={0}
        />
        <Obstacle
          width={OBSTACLE_WITDH}
          height={bottomObstacleheight}
          left={obstacleLeft}
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleheight)}
        />
        <Bird size={BIRD_SIZE} top={birdPosition} />
      </GameBox>
      <span>{score}</span>
    </Div>
  );
}

export default App;

const Bird = styled.div`
  position: absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span {
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameBox = styled.div`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background-color: blue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  background-color: green;
  top: ${(props) => props.top}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`;
