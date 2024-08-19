const baseUrl = "https://dev-kbw-event.myabcwallet.com/";

const passTwalletUrl = baseUrl + "v1/twallet/pass";
const signupTwalletUrl = baseUrl + "v1/twallet/signup";
const tokenEventUrl = baseUrl + "v1/twallet/event/token";

const referrralEventUrl = baseUrl + "v1/event/referral";
const rankingApiUrl = baseUrl + "v1/event/ranking";
const userInfoApiUrl = baseUrl + "v1/event/user/info";
const userApiUrl = baseUrl + "v1/event/user";
const roulettePlayApiUrl = baseUrl + "v1/event/play/roulette";
const rankingTableBody = document.getElementById("ranking-table-body");

let isLogined = false;
let isVerified = false;
let invitingCode = "";
let invitedCode = "";
let appUid = "";
let accessToken = "";
let eventToken = "";
let aptosBalance = 0;
let spinLeftCount = 0;
let userLang = "ko";

document.addEventListener("DOMContentLoaded", async function () {
  /*  */
  function detectLangauge() {
    userLang = navigator.language || navigator.userLanguage;
    if (userLang && !userLang.includes("ko")) {
      switchToEnglish();
    }
  }

  function switchToEnglish() {
    document.querySelector(".title-event-text-1").src =
      "assets/images/title_event_text_en_1.svg";
    document.querySelector(".title-event-text-2").src =
      "assets/images/title_event_text_en_2.svg";

    document.querySelector(".content-event-text-1").innerHTML =
      "Invite&nbsp;friends&nbsp;and play&nbsp;together to&nbsp;get&nbsp;Aptos";

    document.querySelector(".content-event-text-2").innerHTML =
      "Connect&nbsp;to&nbsp;T&nbsp;wallet, Invite&nbsp;More&nbsp;Friends, Get&nbsp;More&nbsp;Rewards!";
    document.querySelector(".content-event-button-text").textContent =
      "Connect T wallet";
    document.querySelector(".invite-code-text").innerHTML =
      "If&nbsp;you&nbsp;have&nbsp;the&nbsp;invitation&nbsp;code, please&nbsp;enter&nbsp;here.";
    document.querySelector(".invite-code-input").placeholder = "e.g. D43X98AD";
    document.querySelector("#verify-invite-code").textContent = "Confirm";

    /*  */
    document.querySelector(".balance-text-1").textContent = "Unclaimed";
    document.querySelector(".balance-text-4").innerHTML =
      "*&nbsp;Event&nbsp;will&nbsp;end when&nbsp;all&nbsp;rewards&nbsp;are&nbsp;claimed.";

    document.querySelector(".second-section .current-title-text").innerHTML =
      "Invite&nbsp;friends&nbsp;and spin&nbsp;100% winning&nbsp;roulette";

    document.querySelector("#current_spin").innerHTML =
      "My Opportunities <span class='current-opportunity-bold-text'>0</span>&nbsp;/&nbsp;0&nbsp;Times";

    document.querySelector(
      ".current-information-content-1"
    ).innerHTML = `<span class="current-information-content-text"
                ><img
                  class="current-information-content-image"
                  src="assets/images/checked_icon.svg"
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
      src="assets/images/checked_icon.svg"
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
    document.querySelector(".event-description").textContent =
      "Top 100 Inviters Get Extra Aptos";
    document.querySelector(".ranking-title").textContent = "Top 100 Inviters";

    const tableHeaders = document.querySelectorAll(".ranking-table th");
    tableHeaders[0].textContent = "Rank";
    tableHeaders[1].textContent = "Wallet Add";
    tableHeaders[2].textContent = "Invites";
    tableHeaders[3].textContent = "Extra";

    document.querySelector(".notice-container-title").textContent =
      "Important Notes";
    const noticeItems = document.querySelectorAll(
      ".notice-container-content li"
    );
    noticeItems[0].textContent =
      "This event will end once all rewards are claimed on a first-come, first-served basis.";
    noticeItems[1].textContent =
      "If participants do not meet the event eligibility criteria (such as nationality) or fail to complete the mission, the rewards may be canceled.";
    noticeItems[2].textContent =
      "Each participant can register (accepting invite) an invite code only once, and no additional invitations can be accepted after the first one.";
    noticeItems[3].textContent =
      "When a wallet is connected to the event page for the first time via an invite link containing an invite code, the invitation is automatically accepted.";
    noticeItems[4].textContent =
      "Participants cannot register their own invite code.";
    noticeItems[5].textContent =
      "If the event ends, any remaining roulette participation opportunities will be automatically forfeited.";
    noticeItems[6].textContent =
      "Due to network conditions, there may be a delay in rewards delivery after the roulette spin.";
    noticeItems[7].textContent =
      "If multiple participants have the same number of invites in the Top Inviter event, the participant who reached that number first will rank higher.";
    noticeItems[8].textContent =
      "Rewards for the Top Inviter event will be distributed after the event ends.";
  }

  detectLangauge();

  /*  */

  /*  */
  const currentUrl = window.location.href;

  const urlParams = new URLSearchParams(window.location.search);
  const invitedCodeFromUrl = urlParams.get("ivtcode");

  const appUidFromUrl = urlParams.get("appuid");

  // v1/twallet/sugbyo API 호출하여 데이터 가져오기
  async function fetchTwalletSignup(appuid) {
    try {
      const params = {
        appuid: appuid,
      };
      const queryString = new URLSearchParams(params).toString();
      const urlWithParams = `${signupTwalletUrl}?${queryString}`;

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

      return data.access_token;
    } catch (error) {
      console.error("Error fetching twallet signup:", error);
      if (userLang && !userLang.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      }
    }
  }

  if (appUidFromUrl) {
    accessToken = await fetchTwalletSignup(appUidFromUrl);
    if (accessToken) {
      eventToken = await fetchTokenEvent(accessToken);
    }

    if (accessToken && eventToken) {
      isLogined = true;
    } else {
      isLogined = false;
    }
  }

  /*  */

  async function registerReferralCode(invitedCode) {
    try {
      const response = await fetch(
        `${referrralEventUrl}/${invitedCode}/register`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${eventToken}`,
          },
        }
      );

      if (!response.ok) {
        sessionStorage.removeItem("ivtcode");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 성공적으로 호출된 경우 패널 삭제
      const invitedCodeContainer = document.getElementById(
        "invited-code-pannel"
      );
      if (invitedCodeContainer) {
        invitedCodeContainer.style.display = "none";
      }
    } catch (error) {
      console.error("Error registering referral code:", error);
      if (userLang && !userLang.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      }
    }
  }

  if (invitedCodeFromUrl) {
    sessionStorage.setItem("ivtcode", invitedCodeFromUrl);
  }

  invitedCode = sessionStorage.getItem("ivtcode");

  if (eventToken && invitedCode) {
    await registerReferralCode(invitedCode);
  }

  /*  */

  /*  */

  let userAccountAddress = null;

  // 유저의 account_address 가져오기
  async function fetchUserAccountAddress(eventToken) {
    try {
      const response = await fetch(userApiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${eventToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.account_address) {
        userAccountAddress = data.account_address;
      }
    } catch (error) {
      console.error("Error fetching user account address:", error);
      if (userLang && !userLang.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      }
    }
  }

  // 랭킹 데이터 가져오기 및 테이블 업데이트
  async function fetchAndPopulateRanking() {
    try {
      const response = await fetch(rankingApiUrl, {
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
      if (userLang && !userLang.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      }
    }
  }

  function populateRankingTable(rankings) {
    // 기존 내용을 지우고 새로운 데이터로 채웁니다.
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

      if (userLang && !userLang.includes("ko")) {
        countCell.textContent = `${rank.referral_count}`;
      } else {
        countCell.textContent = `${rank.referral_count}명`;
      }

      const rewardCell = document.createElement("td");
      rewardCell.textContent = `+${rank.reward} APT`;

      // 만약 현재 사용자 주소와 일치하는 행이라면 스타일을 추가합니다.
      if (userAccountAddress && userAccountAddress === rank.referrer_address) {
        // 각 셀에 대해 스타일을 적용합니다.
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
    await fetchUserAccountAddress(eventToken);
  }

  // 페이지 로드 시 랭킹 데이터 불러오기
  await fetchAndPopulateRanking();

  // 30초마다 랭킹을 업데이트
  setInterval(fetchAndPopulateRanking, 30000);

  /*  */

  const balanceTextElement = document.getElementById("balance-text");
  const apiUrl = baseUrl + "v1/event/remaining/amount";

  async function updateBalance() {
    try {
      const response = await fetch(apiUrl, {
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
      if (userLang && !userLang.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      }
    }
  }

  // 페이지 로드 시 초기 수량 업데이트
  updateBalance();

  // 5초마다 수량 업데이트
  setInterval(updateBalance, 5000);

  /*  */

  /*  */

  handleLoginStatusChange();

  const connectWalletButton = document.getElementById("connect-wallet");

  if (connectWalletButton) {
    connectWalletButton.addEventListener("click", async function () {
      if (!isLogined) {
        window.location.href = passTwalletUrl;
      } else {
        // 현재 URL 가져오기
        const currentUrl = new URL(window.location.href);

        // appuid 파라미터 제거
        currentUrl.searchParams.delete("appuid");

        // ivtcode 파라미터 추가 또는 수정
        const inviteCode = invitingCode; // 원하는 초대 코드를 설정하세요
        currentUrl.searchParams.set("ivtcode", inviteCode);

        // 수정된 URL을 클립보드에 복사
        const linkTextToCopy = currentUrl.toString();
        navigator.clipboard.writeText(linkTextToCopy).then(
          function () {
            // 성공적으로 복사되었을 때 툴팁 표시
            if (userLang && !userLang.includes("ko")) {
              showTooltip(connectWalletButton, "Copied!");
            } else {
              showTooltip(connectWalletButton, "복사되었습니다.");
            }
          },
          function (err) {
            // 복사 실패 시
            console.error("클립보드에 복사할 수 없습니다.", err);
          }
        );
      }
    });
  } else {
    console.error("버튼을 찾을 수 없습니다.");
  }

  const inviteWalletButton = document.getElementById("invite-event");

  if (inviteWalletButton) {
    inviteWalletButton.addEventListener("click", function () {
      if (invitingCode) {
        navigator.clipboard.writeText(invitingCode).then(
          function () {
            if (userLang && !userLang.includes("ko")) {
              showTooltip(inviteWalletButton, "Copied!");
            } else {
              showTooltip(inviteWalletButton, "복사되었습니다.");
            }
          },
          function (err) {
            console.error("클립보드에 복사할 수 없습니다.", err);
          }
        );
      }
    });
  }

  /*  */

  // 초대 링크 복사 버튼 이벤트 리스너
  const copyLinkButton = document.getElementById("copy-link");

  if (copyLinkButton) {
    copyLinkButton.addEventListener("click", function () {
      if (isLogined) {
        const currentUrl = new URL(window.location.href);

        // appuid 파라미터 제거
        currentUrl.searchParams.delete("appuid");

        // ivtcode 파라미터 추가 또는 수정
        const inviteCode = invitingCode; // 초대 코드를 설정
        currentUrl.searchParams.set("ivtcode", inviteCode);

        // 수정된 URL을 클립보드에 복사
        const linkTextToCopy = currentUrl.toString();
        navigator.clipboard.writeText(linkTextToCopy).then(
          function () {
            if (userLang && !userLang.includes("ko")) {
              showTooltip(copyLinkButton, "Copied!");
            } else {
              showTooltip(copyLinkButton, "복사되었습니다.");
            }
          },
          function (err) {
            console.error("클립보드에 복사할 수 없습니다.", err);
          }
        );
      }
    });
  }

  function showTooltip(element, message) {
    // 툴팁을 생성합니다.
    const tooltip = document.createElement("span");
    tooltip.className = "tooltip";
    tooltip.textContent = message;

    // 툴팁 스타일
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#333";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "5px 10px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.fontSize = "14px";
    tooltip.style.zIndex = "10";

    // 툴팁의 위치를 중앙으로 맞추기 위해 요소의 크기와 위치를 계산
    const elementRect = element.getBoundingClientRect();
    /* const tooltipWidth = tooltip.offsetWidth; */

    // 버튼의 중앙에 위치시키고, 아래로 5px 간격
    tooltip.style.top = `${elementRect.height + 5}px`;
    /* tooltip.style.left = `${tooltipWidth / 2}px`; */

    // 삼각형(화살표) 요소를 생성합니다.
    const arrow = document.createElement("div");
    arrow.style.position = "absolute";
    arrow.style.top = "-5px";
    arrow.style.left = "50%";
    arrow.style.transform = "translateX(-50%)";
    arrow.style.width = "0";
    arrow.style.height = "0";
    arrow.style.borderLeft = "5px solid transparent";
    arrow.style.borderRight = "5px solid transparent";
    arrow.style.borderBottom = "5px solid #333"; // 삼각형의 색상을 툴팁의 배경과 맞춥니다.

    // 툴팁에 화살표를 추가합니다.
    tooltip.appendChild(arrow);

    // 툴팁을 DOM에 추가합니다.
    element.appendChild(tooltip);

    // 2초 후 툴팁 제거
    setTimeout(() => {
      tooltip.remove();
    }, 2000);
  }

  /*  */

  const inviteCodeButton = document.getElementById("verify-invite-code");

  if (inviteCodeButton) {
    inviteCodeButton.addEventListener("click", async function () {
      const inviteCodeInput = document.getElementById("invite-code-input");
      const inviteCodeText = document.getElementById("invite-code-text");
      const invitedCodeContainer = document.getElementById(
        "invited-code-pannel"
      );

      // 초대 코드 유효성 검사
      const codePattern = /^[A-Z0-9]{8}$/; // 영대문자, 숫자만 허용, 최대 8자

      if (!codePattern.test(inviteCodeInput.value)) {
        isVerified = false;
      } else {
        isVerified = true;
        await registerReferralCode(inviteCodeInput.value);
      }

      let messageElement = document.getElementById("verify-error-message");

      if (isVerified) {
        // 유효성 검사를 통과한 경우, 기존 메시지를 삭제
        if (messageElement) {
          messageElement.remove();
        }

        // 버튼 텍스트를 "등록완료"로 변경
        inviteCodeButton.textContent = "등록완료";
        inviteCodeButton.style.border = "#E3E4E8";
        inviteCodeButton.style.backgroundColor = "#E3E4E8";
        inviteCodeButton.style.width = "100px";
        inviteCodeButton.style.cursor = "not-allowed";

        inviteCodeText.innerHTML = "초대해 준 친구에게<br />혜택이 돌아갔어요!";

        // Input 요소 비활성화
        inviteCodeInput.disabled = true;
        inviteCodeInput.style.color = "#B1B1B1";

        // 버튼 스타일 업데이트
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
        // 유효성 검사를 통과하지 못한 경우, 오류 메시지를 표시
        if (!messageElement) {
          messageElement = document.createElement("span");

          if (userLang && !userLang.includes("ko")) {
            messageElement.textContent = "Please check your code again.";
          } else {
            messageElement.textContent = "코드를 다시 확인해주세요.";
          }

          messageElement.style.color = "#FF0000"; // 빨간색 텍스트
          messageElement.style.marginTop = "10px"; // 약간의 여백 추가
          messageElement.style.marginLeft = "10px"; // 약간의 여백 추가
          messageElement.style.display = "block";
          messageElement.id = "verify-error-message"; // id 설정

          invitedCodeContainer.appendChild(messageElement);
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
    aptos_01: tempAssetsPath + "aptos_01_image.svg",
    aptos_02: tempAssetsPath + "aptos_02_image.svg",
    aptos_03: tempAssetsPath + "aptos_03_image.svg",
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

  const updateCanvasSize = () => {
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

  const fetchSpinResult = async (eventToken) => {
    try {
      const response = await fetch(roulettePlayApiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${eventToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data.score_index;
    } catch (error) {
      console.error("Error fetching spin result:", error);
      if (userLang && !userLang.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      }
      return null;
    }
  };

  const spin = async () => {
    spinning = true;
    updateButtonState();

    rotate = 0; // 초기화
    canvas.style.transition = "none"; // 초기화
    canvas.style.transform = `rotate(${rotate}deg)`; // 초기화

    const randomSpin = Math.floor(Math.random() * list.length);
    let selectedIndex = await fetchSpinResult(eventToken);

    if (!selectedIndex) {
      selectedIndex = randomSpin;
    }

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
      if (userLang && !userLang.includes("ko")) {
        showPopup(`Congratulations!<br/>You've won ${selectedItem.text}!`);
      } else {
        showPopup(`짝짝짝!<br/>${selectedItem.text}에 당첨되었어요!`);
      }
      await fetchUserInfo(eventToken);
    }
  };

  const updateButtonState = () => {
    if (spinning) {
      spinButton.disabled = true;
      spinButton.style.cursor = "not-allowed";
    } else {
      spinButton.disabled = false;
      spinButton.style.cursor = "pointer";
    }
  };

  const closePopupButton = document.getElementById("closePopup");

  closePopupButton.addEventListener("click", function () {
    popup.style.display = "none";
  });

  spinButton.addEventListener("click", () => {
    if (!isLogined) {
      if (userLang && !userLang.includes("ko")) {
        showPopup("Please connect T wallet.");
      } else {
        showPopup("T wallet을 연결해주세요.");
      }
    } else if (aptosBalance <= 0) {
      if (userLang && !userLang.includes("ko")) {
        showPopup("The event has ended.");
      } else {
        showPopup(`이벤트가<br/>선착순 마감되었습니다.`);
      }
    } else if (!spinLeftCount) {
      if (userLang && !userLang.includes("ko")) {
        showPopup(
          "You've used all your event<br/>participation chances.<br/>Try invite more friends!"
        );
      } else {
        showPopup(
          `이벤트 참여 기회를<br/>모두 소진했어요.<br/>더 많은 친구를 초대해보세요!`
        );
      }
    } else if (!spinning) {
      spin();
    }
  });

  updateCanvasSize();
});

// v1/twallet/event/token API 호출하여 데이터 가져오기
async function fetchTokenEvent(accessToken) {
  try {
    const response = await fetch(tokenEventUrl, {
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

    return data.event_token;
  } catch (error) {
    console.error("Error fetching token event:", error);
    if (userLang && !userLang.includes("ko")) {
      showPopup("The network connection is unstable.");
    } else {
      showPopup("네트워크 연결이 불안정해요.");
    }
  }
}

function showPopup(message) {
  const popupOverlay = document.getElementById("popup");
  const popupContent = document.getElementById("popup-html");
  popupContent.innerHTML = message;
  popupOverlay.style.display = "flex";
}

// 전역 범위에 함수 정의
async function initWithAccessToken(accessToken) {
  eventToken = await fetchTokenEvent(accessToken);
  if (accessToken) {
    eventToken = await fetchTokenEvent(accessToken);
  }

  if (accessToken && eventToken) {
    isLogined = true;
    await handleLoginStatusChange(); // 로그인 상태에 맞춰 UI와 데이터를 업데이트
  } else {
    isLogined = false;
  }
}

async function handleLoginStatusChange() {
  const invitedCodeContainer = document.getElementById("invited-code-pannel");
  const invitingCodeContainer = document.getElementById("inviting-code-pannel");
  const connectWalletButton = document.getElementById("connect-wallet");

  if (isLogined) {
    invitedCodeContainer.style.display = "flex";
    invitingCodeContainer.style.display = "flex";

    // 버튼의 텍스트를 "친구 초대 링크 복사하기"로 변경
    if (userLang && !userLang.includes("ko")) {
      connectWalletButton.innerHTML = `
      <span class="content-event-button-text">Copy invite link</span>
    `;
    } else {
      connectWalletButton.innerHTML = `
      <span class="content-event-button-text">친구 초대 링크 복사하기</span>
    `;
    }

    // 페이지 로드 시 API 호출하여 정보 가져오기
    const receivedReferralCode = await fetchUserInfo(eventToken);

    if (receivedReferralCode) {
      invitedCodeContainer.style.display = "none";
    }
  } else {
    invitedCodeContainer.style.display = "none";
    invitingCodeContainer.style.display = "none";
  }
}

// v1/event/user/info API 호출하여 데이터 가져오기
async function fetchUserInfo(eventToken) {
  try {
    const response = await fetch(userInfoApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${eventToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 받아온 데이터로 HTML 요소 채우기
    if (data && data.event_user) {
      document.getElementById("inviting-code").textContent =
        data.event_user.referral_code;

      if (userLang && !userLang.includes("ko")) {
        document.getElementById("inviting-count").textContent = `${
          data.referral_count || 0
        }`;
      } else {
        document.getElementById("inviting-count").textContent = `${
          data.referral_count || 0
        }명`;
      }

      if (userLang && !userLang.includes("ko")) {
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

      if (userLang && !userLang.includes("ko")) {
        document.getElementById(
          "current_spin"
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
          "current_spin"
        ).innerHTML = `내 이벤트 참여 기회 <span class="current-opportunity-bold-text">${
          data.event_user.max_roulette_spins -
            data.event_user.total_roulette_spins || 0
        }회</span
                >&nbsp;/&nbsp;${data.event_user.max_roulette_spins || 0}회
              </span>
              </span>
              `;
      }

      spinLeftCount =
        data.event_user.max_roulette_spins -
          data.event_user.total_roulette_spins || 0;
      invitingCode = data.event_user.referral_code;
      userAccountAddress = data.event_user.account_address; // 필요한 경우 계정 주소 저장

      return data.received_referral_code;
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    if (userLang && !userLang.includes("ko")) {
      showPopup("The network connection is unstable.");
    } else {
      showPopup("네트워크 연결이 불안정해요.");
    }
  }
}
