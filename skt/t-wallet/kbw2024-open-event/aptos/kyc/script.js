const baseUrl = "https://dev-kbw-event.myabcwallet.com/";

const fetchTwalletKycUserUrl = baseUrl + "v1/twallet/kyc/user";
const fetchTwalletKycTokenUrl = baseUrl + "v1/twallet/kyc/token";
const fetchTwalletEventTokenUrl = baseUrl + "v1/twallet/event/token";
const fetchMpcGenerateWalletKycUrl = baseUrl + "v1/mpc/generate/wallet/kyc";

const loadingAnimation = "./assets/images/loading_animation.svg";
const closeImage = "./assets/images/close_image.svg";
const doneImage = "./assets/images/done_image.svg";
const successImage = "./assets/images/success_image.svg";

/* TODO */
/* DEV */
const eventPath = "/skt/t-wallet/kbw2024-open-event/aptos/opened/index.html";
/* PRODUCTION */
/* const eventPath = "/event/season3"; */

let url = "";
let email = "";
let userId = "";
let recovery = false;
let statusCheckInterval;

let accessToken = "";
let eventToken = "";

document.addEventListener("DOMContentLoaded", async function () {
  url = sessionStorage.getItem("url");
  email = sessionStorage.getItem("email");
  userId = sessionStorage.getItem("user-id");
  recovery = sessionStorage.getItem("recovery");

  accessToken = sessionStorage.getItem("access-token");
  eventToken = sessionStorage.getItem("event-token");

  if (accessToken && eventToken) {
    const currentUrl = new URL(window.location.href);
    currentUrl.pathname = eventPath;
    window.location.href = currentUrl.toString();
  }

  console.log(
    `url, email, userId, recovery: ${url}, ${email}, ${userId}, ${recovery}`
  );

  // Function to detect language and switch to English if needed
  async function detectLangauge() {
    browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage && !browserLanguage.includes("ko")) {
      switchToEnglish();
    }
  }

  function switchToEnglish() {
    document.querySelector(".kyc-input-title").textContent =
      "Please enter your email.";
    document.querySelector(".kyc-button").textContent = "Verify";
  }

  detectLangauge();

  const emailInput = document.getElementById("email-input");
  const kycButton = document.getElementById("kyc-button");

  emailInput.addEventListener("input", () => {
    const emailValue = emailInput.value;
    if (validateEmail(emailValue)) {
      kycButton.classList.add("active");
      kycButton.disabled = false;
    } else {
      kycButton.classList.remove("active");
      kycButton.disabled = true;
    }
  });

  // Function to fetch KYC user data
  async function fetchTwalletKycUser(email) {
    try {
      const response = await fetch(fetchTwalletKycUserUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      url = data.url;
      email = data.email;
      userId = data.user_id;
      recovery = data.recovery;

      sessionStorage.setItem("url", url);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("user-id", userId);
      sessionStorage.setItem("recovery", recovery);

      if (url) {
        window.open(url, "_blank");
      }

      // Clear the existing interval if any
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }

      // Start a new interval for checking the KYC user status
      fetchTwalletKycUserStatus(userId);
      intervalFetchTwalletKycUserStatus(userId);

      return data;
    } catch (error) {
      console.error("Error fetching twallet kyc user:", error);
      if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("KYC verification failed.<br/>Please try again.");
      } else {
        showPopup("KYC 인증에 실패했습니다.<br/>다시 시도해주세요.");
      }
    }
  }

  if (email) {
    emailInput.value = email;

    kycButton.classList.add("active");
    kycButton.disabled = false;

    if (browserLanguage && !browserLanguage.includes("ko")) {
      document.querySelector(".kyc-button").textContent = "Initialize";
    } else {
      document.querySelector(".kyc-button").textContent = "초기화";
    }

    emailInput.disabled = true;

    fetchTwalletKycUserStatus(userId);
    intervalFetchTwalletKycUserStatus(userId);
  }

  kycButton.addEventListener("click", async () => {
    if (
      kycButton.textContent === "Initialize" ||
      kycButton.textContent === "초기화"
    ) {
      sessionStorage.removeItem("url");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("user-id");
      sessionStorage.removeItem("recovery");
      sessionStorage.removeItem("access-token");
      sessionStorage.removeItem("event-token");
      window.location.reload();
    } else {
      const emailValue = emailInput.value;
      if (validateEmail(emailValue)) {
        const response = await fetchTwalletKycUser(emailValue);
        console.log(`response: ${JSON.stringify(response)}`);

        if (browserLanguage && !browserLanguage.includes("ko")) {
          document.querySelector(".kyc-button").textContent = "Initialize";
        } else {
          document.querySelector(".kyc-button").textContent = "초기화";
        }

        emailInput.disabled = true;
      }
    }
  });

  function validateEmail(email) {
    const emailRegularExpression =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegularExpression.test(String(email).toLowerCase());
  }

  function showPopup(message) {
    const popupOverlay = document.getElementById("popup");
    const popupContent = document.getElementById("popup-html");
    popupContent.innerHTML = message;
    popupOverlay.style.display = "flex";
  }

  const closePopupButton = document.getElementById("close-popup");

  closePopupButton.addEventListener("click", function () {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
  });

  async function fetchTwalletKycUserStatus(userId) {
    try {
      const response = await fetch(
        `${fetchTwalletKycUserUrl}/${userId}/status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      const status = data.status;

      console.log(`data: ${JSON.stringify(data)}`);

      if (
        status === "requested" ||
        status === "pending" ||
        status === "faceauthRequested"
      ) {
        showStatusComponent("Standby");
      } else if (
        status === "rejected" ||
        status === "emailExpired" ||
        status === "faceauthRejected"
      ) {
        showStatusComponent("Rejected");
      } else if (status === "emailRequested") {
        showStatusComponent("AuthentificationStanby");
      } else if (
        status === "emailApproved" ||
        status === "faceauthApproved" ||
        status === "walletCreated"
      ) {
        showStatusComponent("AuthentificationApproved");
      }
    } catch (error) {
      console.error("Error checking status:", error);
      if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("KYC status check failed.<br/>Please try again.");
      } else {
        showPopup("KYC 상태 확인에 실패했습니다.<br/>다시 시도해주세요.");
      }
    }
  }

  function intervalFetchTwalletKycUserStatus(userId) {
    statusCheckInterval = setInterval(() => {
      fetchTwalletKycUserStatus(userId);
    }, 5000);
  }

  function showStatusComponent(status) {
    const statusContainer = document.getElementById("status-container");
    if (status === "Standby") {
      if (browserLanguage && !browserLanguage.includes("ko")) {
        statusContainer.innerHTML = `
            <div class="kyc-status-container">
                <img src=${loadingAnimation} alt="Loading" />
                <div class="kyc-status-title">Waiting for&nbsp;KYC&nbsp;certification.</div>
                <div class="kyc-status-text">Leaving&nbsp;or&nbsp;exiting the&nbsp;screen will&nbsp;maintain&nbsp;the&nbsp;progress.</div>
            </div>
            `;
      } else {
        statusContainer.innerHTML = `
            <div class="kyc-status-container">
                <img src=${loadingAnimation} alt="Loading" />
                <div class="kyc-status-title">KYC 인증을 대기하고 있어요.</div>
                <span class="kyc-status-text">화면을&nbsp;나가거나&nbsp;종료해도 진행&nbsp;상태는&nbsp;유지됩니다.</span>                
            </div>
            `;
      }
    } else if (status === "Rejected") {
      if (browserLanguage && !browserLanguage.includes("ko")) {
        statusContainer.innerHTML = `
            <div class="kyc-status-container">
                <img src=${closeImage} alt="Close" />
                <div class="kyc-status-title">KYC certification failed.</div>
                <div class="kyc-status-text">Please try again.</div>
            </div>
            `;
      } else {
        statusContainer.innerHTML = `
            <div class="kyc-status-container">
                <img src=${closeImage} alt="Close" />
                <div class="kyc-status-title">KYC 인증에 실패했습니다.</div>
                <div class="kyc-status-text">처음부터 다시 시도해주세요.</div>
            </div>
            `;
      }
    } else if (status === "AuthentificationStanby") {
      if (browserLanguage && !browserLanguage.includes("ko")) {
        statusContainer.innerHTML = `
            <div class="kyc-status-container">
                <img src=${doneImage} alt="Done" />
                <div class="kyc-status-title">KYC approval completed.</div>
                <div class="kyc-status-text">Please&nbsp;proceed after&nbsp;checking&nbsp;the&nbsp;authentication in&nbsp;the&nbsp;email&nbsp;sent.</div>
            </div>
            <div class="button-container">
                  <button class="kyc-button">Next</button>
            </div>
            `;
      } else {
        statusContainer.innerHTML = `
            <div class="kyc-status-container">
                <img src=${doneImage} alt="Done" />
                <div class="kyc-status-title">KYC 승인이 완료되었습니다.</div>
                <div class="kyc-status-text">전송된&nbsp;이메일에서&nbsp;인증&nbsp;확인&nbsp;후 진행해&nbsp;주세요.</div>
            </div>
            <div class="button-container">
                  <button class="kyc-button">다음</button>
            </div>
            `;
      }
    } else if (status === "AuthentificationApproved") {
      if (browserLanguage && !browserLanguage.includes("ko")) {
        statusContainer.innerHTML = `
            <div class="kyc-status-container">
                <img src=${doneImage} alt="Done" />
                <div class="kyc-status-title">KYC approval completed.</div>
                <div class="kyc-status-text">Please&nbsp;check the&nbsp;authentication in&nbsp;the&nbsp;email&nbsp;sent and press&nbsp;the&nbsp;[Next]&nbsp;button at&nbsp;the&nbsp;bottom.</div>                                
            </div>
            <div class="button-container">
                  <button class="kyc-button active" id="generate-kyc-wallet-button">Next</button>
            </div>
            `;
      } else {
        statusContainer.innerHTML = `
            <div class="kyc-status-container">
                <img src=${doneImage} alt="Done" />
                <div class="kyc-status-title">KYC 승인이 완료되었습니다.</div>
                <div class="kyc-status-text">전송된&nbsp;이메일에서&nbsp;인증&nbsp;확인&nbsp;후 하단의&nbsp;[다음]&nbsp;버튼을&nbsp;눌러주세요.</div>                
            </div>
            <div class="button-container">
                  <button class="kyc-button active" id="generate-kyc-wallet-button">다음</button>
            </div>
            `;
      }

      document
        .getElementById("generate-kyc-wallet-button")
        .addEventListener("click", async () => {
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
          }

          accessToken = await fetchTwalletKycToken(userId);
          if (accessToken) {
            eventToken = await fetchTwalletEventToken(accessToken);
          }

          if (accessToken && eventToken) {
            showStatusComponent("Created");
          }
        });
    } else if (status === "Created") {
      if (browserLanguage && !browserLanguage.includes("ko")) {
        statusContainer.innerHTML = `
          <div class="kyc-status-container">
            <img src=${successImage} alt="Done" />
            <div class="kyc-status-title">T wallet is connected successfully.</div>
          </div>
          <div class="button-container">
            <button class="kyc-button active" id="redirect-kyc-wallet-button">Confirm</button>
          </div>
          `;
      } else {
        statusContainer.innerHTML = `
          <div class="kyc-status-container">
            <img src=${successImage} alt="Done" />
            <div class="kyc-status-title">T wallet 연결에 성공했어요.</div>            
          </div>
          <div class="button-container">
            <button class="kyc-button active" id="redirect-kyc-wallet-button">확인</button>
          </div>
          `;
      }

      document
        .getElementById("redirect-kyc-wallet-button")
        .addEventListener("click", async () => {
          const currentUrl = new URL(window.location.href);
          currentUrl.pathname = eventPath;
          window.location.href = currentUrl.toString();
        });
    }
  }

  async function fetchTwalletKycToken(userId) {
    try {
      const response = await fetch(fetchTwalletKycTokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kyc_user_id: userId }),
      });

      const data = await response.json();

      sessionStorage.setItem("access-token", data.access_token);
      return data.access_token;
    } catch (error) {
      console.error("Error fetching twallet kyc token:", error);
      if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("KYC token fetching failed.<br/>Please try again.");
      } else {
        showPopup("KYC 토큰 가져오기에 실패했습니다.<br/>다시 시도해주세요.");
      }
    }
  }

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
        eventToken = await fetchMpcGenerateWalletKyc(accessToken);
        return eventToken;
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

  async function fetchMpcGenerateWalletKyc(accessToken) {
    try {
      const response = await fetch(fetchMpcGenerateWalletKycUrl, {
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
      console.error("Error fetching kyc wallet generate:", error);
      if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      }
    }
  }
});
