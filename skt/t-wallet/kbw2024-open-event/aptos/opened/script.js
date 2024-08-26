const baseUrl = "https://dev-kbw-event.myabcwallet.com/";

const fetchTwalletPassUrl = baseUrl + "v1/twallet/pass";
/* TODO */
/* DEV */
const fetchTwalletKycUrl = "./../kyc/index.html";
/* PRODUCTION */
/* const fetchTwalletKycUrl = "./../kyc/process"; */

const fetchTwalletSignupUrl = baseUrl + "v1/twallet/signup";
const fetchTwalletEventTokenUrl = baseUrl + "v1/twallet/event/token";
const fetchAbcwalletEventTokenUrl = baseUrl + "v1/abcwallet/event/token";
const fetchMpcGenerateWalletPassUrl = baseUrl + "v1/mpc/generate/wallet/pass";
const fetchEventReferralUrl = baseUrl + "v1/event/referral";
const fetchEventRankingUrl = baseUrl + "v1/event/ranking";
const fetchEventRemainingAmountUrl = baseUrl + "v1/event/remaining/amount";
const fetchEventUserInfoUrl = baseUrl + "v1/event/user/info";
const fetchEventUserUrl = baseUrl + "v1/event/user";
const fetchEventPlayRouletteUrl = baseUrl + "v1/event/play/roulette";

let isLogggedIn = false;
let isVerified = false;

let invitedCode = "";
let invitingCode = "";
let appUid = "";
let accessToken = "";
let eventToken = "";
let accountAddress = "";
let aptosBalance = 0;
let spinOpportunity = 0;
let browserLanguage = "ko";
let receivedReferralCode = "";

document.addEventListener("DOMContentLoaded", async function () {
  accessToken = sessionStorage.getItem("access-token");
  eventToken = sessionStorage.getItem("event-token");

  if (accessToken && eventToken) {
    isLogggedIn = true;
  }

  /*  */

  async function detectLangauge() {
    browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage && !browserLanguage.includes("ko")) {
      switchToEnglish();
    }
  }

  function switchToEnglish() {
    document.querySelector(".title-event-text-1").src =
      "./assets/images/title_event_text_en_1.svg";
    document.querySelector(".title-event-text-2").src =
      "./assets/images/title_event_text_en_2.svg";
    document.querySelector(".content-event-text-1").innerHTML =
      "Invite&nbsp;friends&nbsp;and play&nbsp;together to&nbsp;get&nbsp;Aptos";
    document.querySelector(".content-event-text-2").innerHTML =
      "Connect&nbsp;to&nbsp;T&nbsp;wallet, Invite&nbsp;More&nbsp;Friends, Get&nbsp;More&nbsp;Rewards!";
    document.querySelector(".content-event-button-text").textContent =
      "Connect T wallet";
    document.querySelector(".invite-code-text").innerHTML =
      "If&nbsp;you&nbsp;have the&nbsp;invitation&nbsp;code, please&nbsp;enter&nbsp;here.";
    document.querySelector(".invite-code-input").placeholder = "e.g. D43X98AD";
    document.querySelector(".invite-code-button").textContent = "Confirm";
    document.querySelector(".close-popup").textContent = "Confirm";
    /*  */
    document.querySelector(".balance-text-1").textContent = "Unclaimed";
    document.querySelector(".balance-text-4").innerHTML =
      "*&nbsp;Event&nbsp;will&nbsp;end when&nbsp;all&nbsp;rewards&nbsp;are&nbsp;claimed.";
    document.querySelector(".second-section .current-title-text").innerHTML =
      "Invite&nbsp;friends&nbsp;and spin&nbsp;100% winning&nbsp;roulette";
    document.querySelector(
      ".second-section .current-opportunity-text"
    ).innerHTML =
      "My Opportunities <span class='current-opportunity-bold-text'>0</span>&nbsp;/&nbsp;0&nbsp;Times";
    document.querySelector(
      ".current-information-content-1"
    ).innerHTML = `<span class="current-information-content-text"
                ><img
                  class="current-information-content-image"
                  src="./assets/images/checked_icon.svg"
                />
                Get&nbsp;3&nbsp;Spins&nbsp;for&nbsp;Connecting</span
              >
              <span class="current-information-content-text"
                >T&nbsp;wallet (1&nbsp;time&nbsp;only)</span
              >`;
    document.querySelector(
      ".current-information-content-2"
    ).innerHTML = `<span class="current-information-content-text"
    ><img
      class="current-information-content-image"
      src="./assets/images/checked_icon.svg"
    />
    3&nbsp;More&nbsp;Spins</span
  >
  <span class="current-information-content-text"
    >for&nbsp;an&nbsp;Every&nbsp;Friend&nbsp;You&nbsp;Invite</span
  >`;
    document.querySelector(".current-content-event-text").textContent =
      "My Event Status";
    document.querySelectorAll(".current-content-event-box-text")[0].innerHTML =
      "Accepted<br />Invitations";
    document.querySelector("#inviting-count").textContent = "0 Friends";
    document.querySelectorAll(".current-content-event-box-text")[1].innerHTML =
      "Event<br />Entries";
    document.querySelector("#acting-count").textContent = "0 Times";
    document.querySelectorAll(".current-content-event-box-text")[2].innerHTML =
      "Total<br />Rewards";
    document.querySelector("#accumulated-reward").innerHTML =
      "0<span class='current-content-event-box-bold-unit-text'>APT</span>";
    document.querySelector(".current-content-invitation-title").textContent =
      "My Code";
    document.querySelector(".current-content-invitation-button").textContent =
      "Copy invite link";
    /*  */
    document.querySelector(".third-section .current-title-text").innerHTML =
      "More&nbsp;Invites&nbsp;= More&nbsp;Rewards!";
    document.querySelector(".event-description").innerHTML =
      "Top&nbsp;100&nbsp;Inviters Get&nbsp;Extra&nbsp;Aptos";
    document.querySelector(".ranking-title").textContent = "Top 100 Inviters";

    const tableHeaderItems = document.querySelectorAll(".ranking-table th");
    tableHeaderItems[0].textContent = "Rank";
    tableHeaderItems[1].textContent = "Wallet Add";
    tableHeaderItems[2].textContent = "Invites";
    tableHeaderItems[3].textContent = "Extra";

    document.querySelector(".notice-container-title").textContent =
      "Important Notes";
    const noticeBodyItems = document.querySelectorAll(
      ".notice-container-content li"
    );
    noticeBodyItems[0].textContent =
      "This event will end once all rewards are claimed on a first-come, first-served basis.";
    noticeBodyItems[1].textContent =
      "If participants do not meet the event eligibility criteria (such as nationality) or fail to complete the mission, the rewards may be canceled.";
    noticeBodyItems[2].textContent =
      "Each participant can register (accepting invite) an invite code only once, and no additional invitations can be accepted after the first one.";
    noticeBodyItems[3].textContent =
      "When a wallet is connected to the event page for the first time via an invite link containing an invite code, the invitation is automatically accepted.";
    noticeBodyItems[4].textContent =
      "Participants cannot register their own invite code.";
    noticeBodyItems[5].textContent =
      "If the event ends, any remaining roulette participation opportunities will be automatically forfeited.";
    noticeBodyItems[6].textContent =
      "Due to network conditions, there may be a delay in rewards delivery after the roulette spin.";
    noticeBodyItems[7].textContent =
      "If multiple participants have the same number of invites in the Top Inviter event, the participant who reached that number first will rank higher.";
    noticeBodyItems[8].textContent =
      "Rewards for the Top Inviter event will be distributed after the event ends.";
  }

  await detectLangauge();

  /*  */

  const urlParams = new URLSearchParams(window.location.search);
  const invitedCodeFromUrl = urlParams.get("ivtcode");
  const appUidFromUrl = urlParams.get("appuid");

  /*  */

  if (invitedCodeFromUrl) {
    sessionStorage.setItem("ivt-code", invitedCodeFromUrl);
  }

  /*  */

  async function fetchTwalletSignup(appuid) {
    try {
      const params = {
        appuid: appuid,
      };
      const queryString = new URLSearchParams(params).toString();
      const urlWithParams = `${fetchTwalletSignupUrl}?${queryString}`;

      const response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      sessionStorage.setItem("access-token", data.access_token);
      return data.access_token;
    } catch (error) {
      console.error("Error fetching twallet signup:", error);
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("appuid");
      window.location.href = currentUrl.toString();
    }
  }

  /*  */

  if (appUidFromUrl) {
    try {
      accessToken = await fetchTwalletSignup(appUidFromUrl);

      if (accessToken) {
        eventToken = await fetchTwalletEventToken(accessToken);
      }

      if (accessToken && eventToken) {
        receivedReferralCode = await fetchEventUserInfo(eventToken);

        isLogggedIn = true;
      } else {
        isLogggedIn = false;
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  }

  /*  */

  async function fetchEventReferral(invitedCode) {
    try {
      const response = await fetch(
        `${fetchEventReferralUrl}/${invitedCode}/register`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${eventToken}`,
          },
        }
      );

      const data = await response.json();

      if (
        data.detail &&
        data.detail ===
          "Referrer code cannot be the same as the user's account address"
      ) {
        /* if (browserLanguage && !browserLanguage.includes("ko")) {
          showPopup("You cannot register with your own code.");
        } else {
          showPopup("자신의 코드로<br />등록할 수 없습니다.");
        } */
        sessionStorage.removeItem("ivt-code");
        return false;
      } else if (data.detail && data.detail === "Referrer code not found") {
        /* if (browserLanguage && !browserLanguage.includes("ko")) {
          showPopup("You cannot register with a wrong code.");
        } else {
          showPopup("잘못된 코드로<br />등록할 수 없습니다.");
        } */
        sessionStorage.removeItem("ivt-code");
        return false;
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error("Error registering referral code:", error);
      if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      }
      return false;
    }
  }

  /*  */

  invitedCode = sessionStorage.getItem("ivt-code");
  /* eventToken = sessionStorage.getItem("event-token"); */

  if (eventToken && invitedCode) {
    receivedReferralCode = await fetchEventUserInfo(eventToken);

    if (!receivedReferralCode) {
      await fetchEventReferral(invitedCode);
      receivedReferralCode = await fetchEventUserInfo(eventToken);
    }
  }

  /*  */

  async function fetchEventUser(eventToken) {
    try {
      const response = await fetch(fetchEventUserUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${eventToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 592) {
        if (browserLanguage && !browserLanguage.includes("ko")) {
          showPopup("The event is not currently ongoing.");
        } else {
          showPopup("이벤트 기간이 아닙니다.");
        }
        return null;
      } else if (response.status === 593) {
        if (browserLanguage && !browserLanguage.includes("ko")) {
          showPopup("You are not eligible to participate in this event.");
        } else {
          showPopup("이벤트 참여 대상자가 아닙니다.");
        }
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.account_address) {
        accountAddress = data.account_address;
      }
    } catch (error) {
      console.error("Error fetching user account address:", error);
      if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      }
    }
  }

  /*  */

  async function fetchEventRanking() {
    try {
      const response = await fetch(fetchEventRankingUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.rankings) {
        populateRankingTable(data.rankings);
      }
    } catch (error) {
      console.error("Error fetching ranking data:", error);
      /* if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      } */
    }
  }

  /*  */

  function populateRankingTable(rankings) {
    const rankingTableBody = document.getElementById("ranking-table-body");

    rankingTableBody.innerHTML = "";

    rankings.forEach((rank, index) => {
      const row = document.createElement("tr");

      const rankCell = document.createElement("td");
      rankCell.textContent = index + 1;

      const addressCell = document.createElement("td");
      addressCell.textContent = `${rank.referrer_address.slice(
        0,
        4
      )}...${rank.referrer_address.slice(-4)}`;

      const countCell = document.createElement("td");

      if (browserLanguage && !browserLanguage.includes("ko")) {
        countCell.textContent = `${rank.referral_count}`;
      } else {
        countCell.textContent = `${rank.referral_count}명`;
      }

      const rewardCell = document.createElement("td");
      rewardCell.textContent = `+${rank.reward} APT`;

      if (accountAddress && accountAddress === rank.referrer_address) {
        [rankCell, addressCell, countCell, rewardCell].forEach((cell) => {
          cell.style.color = "#3617CE";
          cell.style.fontFamily = "Gmarket Sans";
          cell.style.fontSize = "14px";
          cell.style.fontStyle = "normal";
          cell.style.fontWeight = "700";
          cell.style.lineHeight = "normal";
        });
      }

      row.appendChild(rankCell);
      row.appendChild(addressCell);
      row.appendChild(countCell);
      row.appendChild(rewardCell);

      rankingTableBody.appendChild(row);
    });
  }

  if (eventToken) {
    await fetchEventUser(eventToken);
  }

  /*  */

  await fetchEventRanking();

  setInterval(fetchEventRanking, 30000);

  /*  */

  async function fetchEventRemainingAmount() {
    try {
      const balanceTextElement = document.getElementById("balance-text");

      const response = await fetch(fetchEventRemainingAmountUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.apt) {
        aptosBalance = data.apt;
        const formattedApt = Number(data.apt.toFixed(1)).toLocaleString();
        balanceTextElement.innerHTML = `${formattedApt}<span class="balance-text-3">&nbsp;APT</span>`;
      }
    } catch (error) {
      console.error("Error fetching remaining amount:", error);
      /* if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      } */
    }
  }

  await fetchEventRemainingAmount();

  setInterval(fetchEventRemainingAmount, 5000);

  /*  */

  if (accessToken && eventToken) {
    handleStatus(eventToken);
  }

  /*  */

  const connectWalletButton = document.getElementById("connect-wallet-button");

  if (connectWalletButton) {
    connectWalletButton.addEventListener("click", async function () {
      if (!isLogggedIn) {
        /* const userAgent =
          navigator.userAgent || navigator.vendor || window.opera;

        const isMobile =
          /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|WPDesktop|Windows Phone/i.test(
            userAgent
          );

        const isTablet =
          /iPad|Tablet|PlayBook/i.test(userAgent) ||
          (isMobile && !/Phone/.test(userAgent));

        const isPC = !isMobile && !isTablet; */

        /* if (isPC) {
          window.location.href = fetchTwalletPassUrl;
        } else { */
        let choicePopupMessage = "";
        let choicePopupTexts = [];
        if (browserLanguage && !browserLanguage.includes("ko")) {
          choicePopupMessage = "Would you like to<br/>connect T Wallet?";
          choicePopupTexts = [
            "Connect with PASS",
            "Connect with Passport",
            "Close",
          ];
        } else {
          choicePopupMessage = "T Wallet을 연결하시겠습니까?";
          choicePopupTexts = ["PASS로 연결하기", "여권으로 연결하기", "닫기"];
        }
        showChoicePopup(choicePopupMessage, choicePopupTexts, [
          function () {
            window.location.href = fetchTwalletPassUrl;
          },
          function () {
            window.location.href = fetchTwalletKycUrl;
          },
          function () {
            closePopup();
          },
        ]);
        /* } */
      } else {
        const currentUrl = new URL(window.location.href);

        currentUrl.searchParams.delete("appuid");

        const inviteCode = invitingCode;
        currentUrl.searchParams.set("ivtcode", inviteCode);

        const linkTextToCopy = currentUrl.toString();
        navigator.clipboard.writeText(linkTextToCopy).then(
          function () {
            if (browserLanguage && !browserLanguage.includes("ko")) {
              showTooltip(connectWalletButton, "Copied!");
            } else {
              showTooltip(connectWalletButton, "복사 되었어요.");
            }
          },
          function (error) {
            console.error("Error copying clipboard:", error);
          }
        );
      }
    });
  }

  function showChoicePopup(message, texts, functions) {
    const popupOverlay = document.createElement("div");
    popupOverlay.className = "popup-overlay";
    popupOverlay.id = "choice-popup";

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";

    let messageElement;

    if (
      message === "T Wallet을 연결하시겠습니까?" ||
      message === "Would you like to<br/>connect T Wallet?"
    ) {
      messageElement = document.createElement("img");
      messageElement.className = "popup-image";
      messageElement.src = "./assets/images/title_wallet_logo.svg";

      messageElementContainer = document.createElement("div");
      messageElementContainer.className = "popup-image-container";
      messageElementContainer.appendChild(messageElement);

      popupContent.appendChild(messageElementContainer);
    } else {
      messageElement = document.createElement("span");
      messageElement.className = "popup-html";
      messageElement.innerHTML = message;
      popupContent.appendChild(messageElement);
    }

    texts.forEach((text, index) => {
      const button = document.createElement("button");
      button.textContent = text;

      if (text === "닫기" || text === "Close") {
        button.className = "popup-empty-button";
      } else {
        button.className = "popup-button";
      }
      if (index > 0) {
        button.style.marginTop = "8px";
      }

      button.addEventListener("click", () => {
        functions[index]();
      });

      popupContent.appendChild(button);
    });

    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);

    popupOverlay.style.display = "flex";
  }

  function closePopup() {
    const popup = document.getElementById("choice-popup");
    popup.remove();
  }

  const inviteWalletButton = document.getElementById("invite-event");

  if (inviteWalletButton) {
    inviteWalletButton.addEventListener("click", function () {
      if (invitingCode) {
        navigator.clipboard.writeText(invitingCode).then(
          function () {
            if (browserLanguage && !browserLanguage.includes("ko")) {
              showTooltip(inviteWalletButton, "Copied!");
            } else {
              showTooltip(inviteWalletButton, "복사 되었어요.");
            }
          },
          function (error) {
            console.error("Error copying clipboard:", error);
          }
        );
      }
    });
  }

  /*  */

  const copyLinkButton = document.getElementById("copy-link");

  if (copyLinkButton) {
    copyLinkButton.addEventListener("click", function () {
      if (isLogggedIn) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("appuid");
        const inviteCode = invitingCode;
        currentUrl.searchParams.set("ivtcode", inviteCode);

        const linkTextToCopy = currentUrl.toString();
        navigator.clipboard.writeText(linkTextToCopy).then(
          function () {
            if (browserLanguage && !browserLanguage.includes("ko")) {
              showTooltip(copyLinkButton, "Copied!");
            } else {
              showTooltip(copyLinkButton, "복사 되었어요.");
            }
          },
          function (error) {
            console.error("Error copying clipboard:", error);
          }
        );
      }
    });
  }

  /*  */

  function showTooltip(element, message) {
    const tooltip = document.createElement("span");
    tooltip.className = "tooltip";
    tooltip.textContent = message;

    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#333";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "12px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.fontSize = "13px";
    tooltip.style.fontWeight = "400";
    tooltip.style.zIndex = "10";
    tooltip.style.fontFamily = "Gmarket Sans";

    const elementRect = element.getBoundingClientRect();

    tooltip.style.top = `${elementRect.height + 5}px`;
    /* tooltip.style.left = `${tooltipWidth / 2}px`; */

    const arrow = document.createElement("div");
    arrow.style.position = "absolute";
    arrow.style.top = "-5px";
    arrow.style.left = "50%";
    arrow.style.transform = "translateX(-50%)";
    arrow.style.width = "0";
    arrow.style.height = "0";
    arrow.style.borderLeft = "5px solid transparent";
    arrow.style.borderRight = "5px solid transparent";
    arrow.style.borderBottom = "5px solid #333";

    tooltip.appendChild(arrow);

    element.appendChild(tooltip);

    setTimeout(() => {
      tooltip.remove();
    }, 2000);
  }

  /*  */

  const inviteCodeButton = document.getElementById("verify-invite-code");

  const inviteCodeInput = document.getElementById("invite-code-input");

  inviteCodeInput.addEventListener("focus", function () {
    inviteCodeInput.setAttribute(
      "data-placeholder",
      inviteCodeInput.getAttribute("placeholder")
    );
    inviteCodeInput.setAttribute("placeholder", "");
  });

  inviteCodeInput.addEventListener("blur", function () {
    inviteCodeInput.setAttribute(
      "placeholder",
      inviteCodeInput.getAttribute("data-placeholder")
    );
  });

  let inviteCodeInputValue = "";

  inviteCodeInput.addEventListener("input", function () {
    let value = inviteCodeInput.value;

    if (value.length > 8) {
      inviteCodeInput.value = inviteCodeInputValue;
    } else {
      value = value
        .replace(/\s+/g, "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");

      const newValue = value.slice(0, 8);

      if (newValue !== inviteCodeInputValue) {
        inviteCodeInputValue = newValue;
        inviteCodeInput.value = inviteCodeInputValue;

        const messageElement = document.getElementById("verify-error-message");
        if (messageElement) {
          messageElement.remove();
        }
      } else {
        inviteCodeInput.value = inviteCodeInputValue;
      }
    }
  });

  /*  */

  if (inviteCodeButton) {
    inviteCodeButton.addEventListener("click", async function () {
      receivedReferralCode = await fetchEventUserInfo(eventToken);

      if (!receivedReferralCode) {
        const inviteCodeInput = document.getElementById("invite-code-input");
        const inviteCodeText = document.getElementById("invite-code-text");
        const invitedCodePannel = document.getElementById(
          "invited-code-pannel"
        );

        if (inviteCodeInput.value) {
          const codePattern = /^[A-Z0-9]{8}$/;

          if (!codePattern.test(inviteCodeInput.value)) {
            isVerified = false;
          } else {
            isVerified = await fetchEventReferral(inviteCodeInput.value);
          }

          let messageElement = document.getElementById("verify-error-message");

          if (isVerified) {
            if (messageElement) {
              messageElement.remove();
            }

            inviteCodeButton.textContent = "등록완료";
            inviteCodeButton.style.border = "#E3E4E8";
            inviteCodeButton.style.backgroundColor = "#E3E4E8";
            inviteCodeButton.style.width = "100px";
            inviteCodeButton.style.cursor = "not-allowed";
            inviteCodeButton.disabled = true;
            inviteCodeText.innerHTML =
              "초대해 준 친구에게<br />혜택이 돌아갔어요!";

            inviteCodeInput.disabled = true;
            inviteCodeInput.style.color = "#B1B1B1";

            inviteCodeButton.style.display = "flex";
            inviteCodeButton.style.padding = "16px";
            inviteCodeButton.style.justifyContent = "center";
            inviteCodeButton.style.alignItems = "center";
            inviteCodeButton.style.color = "#ABAEBA";
            inviteCodeButton.style.textAlign = "center";
            inviteCodeButton.style.fontFamily = "Gmarket Sans";
            inviteCodeButton.style.fontSize = "14px";
            inviteCodeButton.style.fontStyle = "normal";
            inviteCodeButton.style.fontWeight = "500";
            inviteCodeButton.style.lineHeight = "normal";
          } else {
            if (!messageElement) {
              messageElement = document.createElement("span");

              if (browserLanguage && !browserLanguage.includes("ko")) {
                messageElement.textContent = "Please check your code again.";
              } else {
                messageElement.textContent = "코드를 다시 확인해주세요.";
              }

              messageElement.style.color = "#FF0000"; // 빨간색 텍스트
              messageElement.style.marginTop = "10px"; // 약간의 여백 추가
              messageElement.style.marginLeft = "10px"; // 약간의 여백 추가
              messageElement.style.display = "block";
              messageElement.id = "verify-error-message"; // id 설정

              invitedCodePannel.appendChild(messageElement);
            }
          }
        }
      }
    });
  }

  /*  */

  const canvas = document.getElementById("rouletteCanvas");
  const spinButton = document.getElementById("spinButton");
  const selector = document.getElementById("selector");

  const tempAssetsPath = "./assets/images/";
  const images = {
    aptos_01: tempAssetsPath + "aptos_01_image.png",
    aptos_02: tempAssetsPath + "aptos_02_image.png",
    aptos_03: tempAssetsPath + "aptos_03_image.png",
    icoDownArrowRed: tempAssetsPath + "roulette_arrow_icon.svg",
  };

  const list = [
    { id: "roulette_6", image: images.aptos_03, text: "0.3 APT" },
    { id: "roulette_5", image: images.aptos_02, text: "0.2 APT" },
    { id: "roulette_4", image: images.aptos_01, text: "0.1 APT" },
    { id: "roulette_3", image: images.aptos_03, text: "0.3 APT" },
    { id: "roulette_2", image: images.aptos_02, text: "0.2 APT" },
    { id: "roulette_1", image: images.aptos_01, text: "0.1 APT" },
  ];

  const colors = [
    "#FFFFFF",
    "#EDEBF7",
    "#FFFFFF",
    "#EDEBF7",
    "#FFFFFF",
    "#EDEBF7",
  ];

  let rotate = 0;
  let easeOut = 3;
  let spinning = false;

  const renderCanvas = () => {
    const canvasSize = 300;
    const arrowLocation = (canvasSize / 400) * 1;
    const arrowSize = (canvasSize / 400) * 60;
    const radiusSize = (canvasSize / 400) * 85;
    const radiusPadding = (radiusSize / 85) * 85;
    const pieceImageSize = (canvasSize / 250) * 30;

    selector.style.top = `${arrowLocation}px`;
    const selectorImg = new Image();
    selectorImg.src = images.icoDownArrowRed;
    selectorImg.width = arrowSize;
    selectorImg.height = arrowSize;
    selector.appendChild(selectorImg);

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    renderWheel(canvasSize, radiusSize, radiusPadding, pieceImageSize);
  };

  const renderWheel = (
    canvasSize,
    radiusSize,
    radiusPadding,
    pieceImageSize
  ) => {
    const numOptions = list.length;
    const arcSize = (2 * Math.PI) / numOptions;

    let angle = 0;
    for (let i = 0; i <= numOptions - 1; i++) {
      renderSector(
        i,
        list[i].image,
        angle,
        arcSize,
        colors[i],
        canvasSize,
        radiusSize,
        radiusPadding,
        pieceImageSize
      );
      angle += arcSize;
    }
  };

  const renderSector = (
    index,
    image,
    start,
    arc,
    color,
    canvasSize,
    radiusSize,
    radiusPadding,
    pieceImageSize
  ) => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      const startAngle = start;
      const endAngle = start + arc;

      ctx.beginPath();
      ctx.arc(x, y, radiusSize, startAngle, endAngle, false);
      ctx.lineWidth = radiusSize * 2;
      ctx.strokeStyle = color;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, radiusSize * 2, startAngle, endAngle, false);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#3617CE";
      ctx.stroke();

      const img = new Image();
      img.src = image;

      img.onload = () => {
        ctx.save();
        const angle = index * arc;
        const baseSize = radiusSize * 2.33;
        const textRadius = baseSize - radiusPadding;
        ctx.translate(
          baseSize + Math.cos(angle - arc / 2) * textRadius,
          baseSize + Math.sin(angle - arc / 2) * textRadius
        );
        ctx.rotate(angle - arc / 2 + Math.PI / 2);
        ctx.drawImage(img, -pieceImageSize / 2, -pieceImageSize / 2, 39, 47);
        ctx.restore();
      };
    }
  };

  const fetchEventPlayRoulette = async (eventToken) => {
    try {
      const response = await fetch(fetchEventPlayRouletteUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${eventToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 592) {
        if (browserLanguage && !browserLanguage.includes("ko")) {
          showPopup("The event is not currently ongoing.");
        } else {
          showPopup("이벤트 기간이 아닙니다.");
        }
        return null;
      } else if (response.status === 593) {
        if (browserLanguage && !browserLanguage.includes("ko")) {
          showPopup("You are not eligible to participate in this event.");
        } else {
          showPopup("이벤트 참여 대상자가 아닙니다.");
        }
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data.score_index;
    } catch (error) {
      console.error("Error fetching spin result:", error);
      if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      }
      return null;
    }
  };

  /*  */

  const spin = async () => {
    rotate = 0; // 초기화
    canvas.style.transition = "none"; // 초기화
    canvas.style.transform = `rotate(${rotate}deg)`; // 초기화

    /* const randomSpin = Math.floor(Math.random() * list.length); */
    let selectedIndex = await fetchEventPlayRoulette(eventToken);

    if (selectedIndex === null) {
      return;
    }

    spinning = true;
    updateButtonState();

    const spins = 30;
    const degreesPerSpin = 360;
    const degreesPerOption = 360 / list.length;
    const rotationForFixedResult = selectedIndex * degreesPerOption;
    const additionalSpins = spins * degreesPerSpin + rotationForFixedResult;

    rotate += additionalSpins;

    canvas.style.transition = `transform ${easeOut}s ease-in-out`;
    canvas.style.transform = `rotate(${rotate}deg)`;

    setTimeout(() => {
      spinning = false;
      updateButtonState();
      getResult(rotate % 360);
    }, easeOut * 1000 + 100);
  };

  const getResult = async (finalAngle) => {
    const degreesPerOption = 360 / list.length;
    const adjustedAngle = (360 - finalAngle + degreesPerOption / 2) % 360;
    let selectedIndex =
      Math.floor(adjustedAngle / degreesPerOption) % list.length;

    if (selectedIndex === 0) {
      selectedIndex = list.length - 1;
    } else {
      selectedIndex -= 1;
    }

    const selectedItem = list[selectedIndex];
    if (selectedItem) {
      if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup(`Congratulations!<br />You've won ${selectedItem.text}!`);
      } else {
        showPopup(`짝짝짝!<br />${selectedItem.text}에 당첨되었어요!`);
      }
      await fetchEventUserInfo(eventToken);
      await fetchEventRemainingAmount();
    }
  };

  /*  */

  const updateButtonState = () => {
    if (spinning) {
      spinButton.disabled = true;
      spinButton.style.cursor = "not-allowed";
    } else {
      spinButton.disabled = false;
      spinButton.style.cursor = "pointer";
    }
  };

  /*  */

  const closePopupButton = document.getElementById("close-popup");

  closePopupButton.addEventListener("click", function () {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
  });

  /*  */

  spinButton.addEventListener("click", async () => {
    if (!isLogggedIn) {
      if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("Please connect T wallet.");
      } else {
        showPopup("T wallet을 연결해주세요.");
      }
    } else if (aptosBalance <= 0) {
      if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("The event has ended.");
      } else {
        showPopup(`이벤트가<br />선착순 마감되었습니다.`);
      }
    } else {
      receivedReferralCode = await fetchEventUserInfo(eventToken);

      if (!spinOpportunity) {
        if (browserLanguage && !browserLanguage.includes("ko")) {
          showPopup(
            "You've used all your event<br />participation chances.<br />Try invite more friends!"
          );
        } else {
          showPopup(
            `이벤트 참여 기회를<br />모두 소진했어요.<br />더 많은 친구를 초대해보세요!`
          );
        }
      } else if (!spinning) {
        spin();
      }
    }
  });

  renderCanvas();
});

/*  */

async function fetchTwalletEventToken(accessToken) {
  try {
    const response = await fetch(fetchTwalletEventTokenUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.detail && data.detail === "User not found") {
      eventToken = await fetchMpcGenerateWalletPass(accessToken);
      return eventToken;
    } else if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      sessionStorage.setItem("event-token", data.event_token);
      return data.event_token;
    }
  } catch (error) {
    console.error("Error fetching token event:", error);
    if (browserLanguage && !browserLanguage.includes("ko")) {
      showPopup("The network connection is unstable.");
    } else {
      showPopup("네트워크 연결이 불안정해요.");
    }
  }
}

async function fetchMpcGenerateWalletPass(accessToken) {
  try {
    const response = await fetch(fetchMpcGenerateWalletPassUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    sessionStorage.setItem("event-token", data.event_token);
    return data.event_token;
  } catch (error) {
    console.error("Error fetching pass wallet generate:", error);
    if (browserLanguage && !browserLanguage.includes("ko")) {
      showPopup("The network connection is unstable.");
    } else {
      showPopup("네트워크 연결이 불안정해요.");
    }
  }
}

/* Common */

function showPopup(message) {
  const popupOverlay = document.getElementById("popup");
  const popupContent = document.getElementById("popup-html");
  popupContent.innerHTML = message;
  popupOverlay.style.display = "flex";
}

/* Mobile Application */
async function initWithAccessToken(accessToken) {
  if (accessToken) {
    eventToken = await fetchAbcwalletEventToken(accessToken);
  }

  if (accessToken && eventToken) {
    isLogggedIn = true;
    await handleStatus(eventToken);
  } else {
    isLogggedIn = false;
  }
}

async function fetchAbcwalletEventToken(accessToken) {
  try {
    const response = await fetch(fetchAbcwalletEventTokenUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    sessionStorage.setItem("event-token", data.event_token);
    return data.event_token;
  } catch (error) {
    console.error("Error fetching token event:", error);
    if (browserLanguage && !browserLanguage.includes("ko")) {
      showPopup("The network connection is unstable.");
    } else {
      showPopup("네트워크 연결이 불안정해요.");
    }
  }
}

async function handleStatus(eventToken) {
  const invitedCodePannel = document.getElementById("invited-code-pannel");
  const invitingCodePannel = document.getElementById("inviting-code-pannel");
  const connectWalletButton = document.getElementById("connect-wallet-button");

  if (isLogggedIn) {
    invitedCodePannel.style.display = "flex";
    invitingCodePannel.style.display = "flex";

    if (browserLanguage && !browserLanguage.includes("ko")) {
      connectWalletButton.innerHTML = `
      <span class="content-event-button-text">Copy invite link</span>
    `;
    } else {
      connectWalletButton.innerHTML = `
      <span class="content-event-button-text">친구 초대 링크 복사하기</span>
    `;
    }

    receivedReferralCode = await fetchEventUserInfo(eventToken);

    if (receivedReferralCode) {
      invitedCodePannel.style.display = "none";
    }
  } else {
    invitedCodePannel.style.display = "none";
    invitingCodePannel.style.display = "none";
  }
}

async function fetchEventUserInfo(eventToken) {
  try {
    const response = await fetch(fetchEventUserInfoUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${eventToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 592) {
      if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("The event is not currently ongoing.");
      } else {
        showPopup("이벤트 기간이 아닙니다.");
      }
      return null;
    } else if (response.status === 593) {
      if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("You are not eligible to participate in this event.");
      } else {
        showPopup("이벤트 참여 대상자가 아닙니다.");
      }
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.event_user) {
      document.getElementById("inviting-code").textContent =
        data.event_user.referral_code;
      if (browserLanguage && !browserLanguage.includes("ko")) {
        document.getElementById("inviting-count").textContent = `${
          data.referral_count || 0
        }`;
      } else {
        document.getElementById("inviting-count").textContent = `${
          data.referral_count || 0
        }명`;
      }
      if (browserLanguage && !browserLanguage.includes("ko")) {
        document.getElementById("acting-count").textContent = `${
          data.event_user.total_roulette_spins || 0
        } Times`;
      } else {
        document.getElementById("acting-count").textContent = `${
          data.event_user.total_roulette_spins || 0
        }회`;
      }
      document.getElementById("accumulated-reward").innerHTML = `${
        data.total_apt || 0
      }
                    <span class="current-content-event-box-bold-unit-text"
                      >APT</span
                    >
      `;
      if (browserLanguage && !browserLanguage.includes("ko")) {
        document.getElementById(
          "spin-status"
        ).innerHTML = `My Opportunities <span class="current-opportunity-bold-text">${
          data.event_user.max_roulette_spins -
            data.event_user.total_roulette_spins || 0
        }</span
                >&nbsp;/&nbsp;${
                  data.event_user.max_roulette_spins || 0
                }&nbsp;Times
              </span>
              </span>
              `;
      } else {
        document.getElementById(
          "spin-status"
        ).innerHTML = `내 이벤트 참여 기회 <span class="current-opportunity-bold-text">${
          data.event_user.max_roulette_spins -
            data.event_user.total_roulette_spins || 0
        }</span
                >&nbsp;/&nbsp;${data.event_user.max_roulette_spins || 0}회
              </span>
              </span>
              `;
      }

      const invitedCodePannel = document.getElementById("invited-code-pannel");
      if (invitedCodePannel && data.received_referral_code) {
        invitedCodePannel.style.display = "none";
      }

      spinOpportunity =
        data.event_user.max_roulette_spins -
          data.event_user.total_roulette_spins || 0;
      invitingCode = data.event_user.referral_code;
      accountAddress = data.event_user.account_address;

      return data.received_referral_code;
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    if (browserLanguage && !browserLanguage.includes("ko")) {
      showPopup("The network connection is unstable.");
    } else {
      showPopup("네트워크 연결이 불안정해요.");
    }
  }
}
