import { useCallback, useEffect, useState } from "react";
import {
  Layout,
  GotchiSelector,
  DetailsPanel,
  Modal,
  GotchiSVG,
} from "components";
import { Link } from "react-router-dom";
import globalStyles from "theme/globalStyles.module.css";
import { useServer } from "server-store";
import { useWeb3, updateAavegotchis } from "web3/context";
import { getDefaultGotchi, getPreviewGotchi } from "helpers/aavegotchi";
import gotchiLoading from "assets/gifs/loading.gif";
import { playSound } from "helpers/hooks/useSound";
import styles from "./styles.module.css";
import cat from "assets/images/cat.png"

const Home = () => {
  const {
    state: {
      usersAavegotchis,
      address,
      selectedAavegotchiId,
      networkId,
      provider,
    },
    dispatch,
  } = useWeb3();
  const { highscores } = useServer();
  const [showRulesModal, setShowRulesModal] = useState(false);

  const useDefaultGotchi = () => {
    dispatch({
      type: "SET_USERS_AAVEGOTCHIS",
      usersAavegotchis: [getDefaultGotchi()],
    });
  };

  const usePreviewGotchis = async () => {
    if (provider) {
      try {
        const gotchi1 = await getPreviewGotchi(provider, {
          name: "GotchiDev",
          id: "OG",
          collateral: "aWETH",
          wearables: [117, 55, 0, 0, 0, 0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          numericTraits: [50, 50, 50, 50, 40, 40]
        });
        const gotchi2 = await getPreviewGotchi(provider, {
          name: "H4cker",
          id: "l33T",
          collateral: "aUSDT",
          wearables: [211, 212, 213, 214, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          numericTraits: [100, 100, 100, 100, 100, 100]
        });
        dispatch({
          type: "SET_USERS_AAVEGOTCHIS",
            usersAavegotchis: [gotchi1, gotchi2],
        }); 
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          error: err
        })
      }
    }
  };

  /**
   * Updates global state with selected gotchi
   */
  const handleSelect = useCallback(
    (gotchiId: string) => {
      dispatch({
        type: "SET_SELECTED_AAVEGOTCHI",
        selectedAavegotchiId: gotchiId,
      });
    },
    [dispatch]
  );

  useEffect(() => {
    if (process.env.REACT_APP_OFFCHAIN) return useDefaultGotchi();

    if (address) {
      const prevGotchis = usersAavegotchis || [];
      if (
        prevGotchis.find(
          (gotchi) => gotchi.owner.id.toLowerCase() === address.toLowerCase()
        )
      )
        return;

      dispatch({
        type: "SET_SELECTED_AAVEGOTCHI",
        selectedAavegotchiId: undefined,
      });
      updateAavegotchis(dispatch, address);
    }
  }, [address]);

  if (networkId !== 137 && !process.env.REACT_APP_OFFCHAIN) {
    return (
      <Layout>
        <div className={globalStyles.container}>
          <div className={styles.errorContainer}>
            <h1>{!networkId ? "Not connected" : "Wrong network"}</h1>
            <p className={styles.secondaryErrorMessage}>
              Please connect to the Polygon network.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (usersAavegotchis && usersAavegotchis?.length <= 0) {
    return (
      <Layout>
        <div className={globalStyles.container}>
          <div className={styles.errorContainer}>
            <p>
              No Aavegotchis found for address - Please make sure the correct
              wallet is connected.
            </p>
            <p className={styles.secondaryErrorMessage}>
              Don’t have an Aavegotchi? Visit the Baazaar to get one.
            </p>
            <a
              href="https://aavegotchi.com/baazaar/portals-closed?sort=latest"
              target="__blank"
              className={globalStyles.primaryButton}
            >
              Visit Bazaar
            </a>
            {/* Allows developers to build without the requirement of owning a gotchi */}
            {process.env.NODE_ENV === "development" && (
              <button
                onClick={usePreviewGotchis}
                className={globalStyles.primaryButton}
              >
                Use Preview Gotchis
              </button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {showRulesModal && (
        <Modal onHandleClose={() => setShowRulesModal(false)}>
          <div className={styles.modalContent}>
            <img src={cat} alt="OOPS" />
          </div>
        </Modal>
      )}
      <div id="title">South Beach ROFL Ball!!</div>
      <p id="controls">Controls:    move left = A or left arrow,   move right = D or right arrow,   jump = space or D or up arrow</p>
      <div className={globalStyles.container}>
        <div className={styles.homeContainer}>
          <div className={styles.selectorContainer}>
            <GotchiSelector
              initialGotchiId={selectedAavegotchiId}
              gotchis={usersAavegotchis}
              selectGotchi={handleSelect}
            />
          </div>
          <div className={styles.gotchiContainer}>
            {selectedAavegotchiId ? (
              <GotchiSVG
                tokenId={selectedAavegotchiId}
                options={{ animate: true, removeBg: true }}
              />
            ) : (
              <img src={gotchiLoading} alt="Loading Aavegotchi" />
            )}
            <h1 className={styles.highscore}>
              Highscore:{" "}
              {(usersAavegotchis &&
                highscores?.find(
                  (score) => score.tokenId === selectedAavegotchiId
                )?.score) ||
                0}
            </h1>
            <div className={styles.buttonContainer}>
              <Link
                to="/play"
                className={`${globalStyles.primaryButton} ${
                  !usersAavegotchis ? globalStyles.disabledLink : ""
                }`}
                onClick={() => playSound("send")}
              >
                Start
              </Link>
              <button
                onClick={() => {
                  playSound("click");
                  setShowRulesModal(true);
                }}
                className={`${globalStyles.secondaryButton} ${globalStyles.circleButton}`}
              >
                ?
              </button>
            </div>
          </div>
          <div className={styles.detailsPanelContainer}>
            <DetailsPanel
              selectedGotchi={usersAavegotchis?.find(
                (gotchi) => gotchi.id === selectedAavegotchiId
              )}
            />
          </div>
        </div>
        <div id="story">GM frens! Its beach day! Grab some sunscreen and your favorite gotchi and head down to South Beach for some fun in the sun! Rofl Ball is going viral in the gotchivese and your frens super excited to play, but not all gotchis are as athletic as others. Frens with high energy will move faster and those with more aggression will be able to push the ball higher. Watch out for pesky crabs on the beach, if your rofl ball gets too close they will pop it! if the gotchi you select is particularly spooky it should scare away some of the more fearful crabs. Your gotchis are not a fan of crabs so every time they get too close your fren will become more irritated. The larger your gotchis brain, the less tolerant they will be of those crabs nipping at their ghostly nethers. Since rofls are so expensive these days, you could only afford 3 rofl balls and when they are gone the game is over. The game will also end if your gotchis irritation tolerance reaches zero and you’ll have pack up and head to the pharmacy for ghost shampoo! </div>
        </div>
    </Layout>
  );
};

export default Home;
