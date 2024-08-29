/* const baseUrl = "https://dev-kbw-event.myabcwallet.com/"; // Development */
const baseUrl = "https://kbw-event.myabcwallet.com/"; // Production

/* const eventPath = "/skt/t-wallet/kbw2024-open-event/aptos/opened/index.html"; // Private */
const eventPath = "/event/season3"; // Public

const fetchTwalletKycUserUrl = baseUrl + "v1/twallet/kyc/user";
const fetchTwalletKycTokenUrl = baseUrl + "v1/twallet/kyc/token";
const fetchTwalletEventTokenUrl = baseUrl + "v1/twallet/event/token";
const fetchMpcGenerateWalletKycUrl = baseUrl + "v1/mpc/generate/wallet/kyc";

const loadingAnimation = "./assets/images/loading_animation.svg";
const closeImage = "./assets/images/close_image.svg";
const doneImage = "./assets/images/done_image.svg";
const successImage = "./assets/images/success_image.svg";

let url = "";
let email = "";
let userId = "";
let recovery = false;
let statusCheckInterval;

let accessToken = "";
let eventToken = "";

document.addEventListener("DOMContentLoaded", async function () {
  gtag("event", "page_kyc_start​", {});

  url = sessionStorage.getItem("url");
  email = sessionStorage.getItem("email");
  userId = sessionStorage.getItem("user-id");
  recovery = sessionStorage.getItem("recovery");

  accessToken = sessionStorage.getItem("access-token");
  eventToken = sessionStorage.getItem("event-token");

  /*  */

  const agreeAllCheckbox = document.getElementById("agree-all");
  const serviceCheckbox = document.getElementById("agree-service");
  const privacyCheckbox = document.getElementById("agree-privacy");
  const kycButton = document.getElementById("kyc-button");
  const emailInput = document.getElementById("email-input");

  const serviceTermsLink = document.getElementById("service-terms-link");
  const privacyPolicyLink = document.getElementById("privacy-policy-link");

  serviceTermsLink.href =
    "https://api.id.myabcwallet.com/query/terms?language=1&service=256";
  privacyPolicyLink.href =
    "https://api.id.myabcwallet.com/query/privacy-policy?language=1&service=256";

  agreeAllCheckbox.addEventListener("change", function () {
    const isChecked = agreeAllCheckbox.checked;
    serviceCheckbox.checked = isChecked;
    privacyCheckbox.checked = isChecked;
    updateButtonState();
  });

  function updateAgreeAllCheckbox() {
    agreeAllCheckbox.checked =
      serviceCheckbox.checked && privacyCheckbox.checked;
    updateButtonState();
  }

  function updateButtonState() {
    const isEmailValid = validateEmail(emailInput.value);
    if ((agreeAllCheckbox.checked && isEmailValid) || email) {
      kycButton.classList.add("active");
      kycButton.disabled = false;
      kycButton.style.cursor = "pointer";
    } else {
      kycButton.classList.remove("active");
      kycButton.disabled = true;
      kycButton.style.cursor = "not-allowed";
    }
  }

  serviceCheckbox.addEventListener("change", updateAgreeAllCheckbox);
  privacyCheckbox.addEventListener("change", updateAgreeAllCheckbox);

  updateButtonState();

  /*  */

  if (accessToken && eventToken) {
    const currentUrl = new URL(window.location.href);
    currentUrl.pathname = eventPath;
    window.location.href = currentUrl.toString();
  }

  // Function to detect language and switch to English if needed
  async function detectLangauge() {
    browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage && !browserLanguage.includes("ko")) {
      switchToEnglish();
    }
  }

  function switchToEnglish() {
    document.getElementById("start-kyc-title").textContent =
      "Start KYC verification.";
    document.getElementById("agree-all-label").textContent =
      "Agree to all terms.";
    document.getElementById("service-terms-title").textContent =
      "T wallet Service Terms";
    document.getElementById(
      "agree-service-label"
    ).innerHTML = `[Required] T&nbsp;wallet <a href="https://api.id.myabcwallet.com/query/terms?language=2&service=256" id="service-terms-link" target="_blank">
               Service&nbsp;Terms&nbsp;of&nbsp;Use</a
              >`;
    document.getElementById(
      "agree-privacy-label"
    ).innerHTML = `[Required] T&nbsp;wallet <a href="https://api.id.myabcwallet.com/query/privacy-policy?language=2&service=256" id="service-terms-link" target="_blank">
               Privacy&nbsp;Policy</a
              >`;
    document.getElementById("email-input-title").textContent =
      "Please enter your email.";
    document.getElementById("kyc-button").textContent = "Verify";
    document.getElementById("close-popup").textContent = "Confirm";
  }

  detectLangauge();

  emailInput.addEventListener("input", () => {
    const emailValue = emailInput.value;
    if (validateEmail(emailValue)) {
      updateButtonState();
    } else {
      updateButtonState();
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
    kycButton.style.cursor = "pointer";

    if (browserLanguage && !browserLanguage.includes("ko")) {
      document.querySelector(".kyc-button").textContent = "Initialize";
    } else {
      document.querySelector(".kyc-button").textContent = "초기화";
    }

    emailInput.disabled = true;
    emailInput.style.cursor = "not-allowed";

    fetchTwalletKycUserStatus(userId);
    intervalFetchTwalletKycUserStatus(userId);
  }

  async function initializeStatus() {
    sessionStorage.removeItem("url");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("user-id");
    sessionStorage.removeItem("recovery");
    sessionStorage.removeItem("access-token");
    sessionStorage.removeItem("event-token");
    window.location.reload();
  }

  kycButton.addEventListener("click", async () => {
    if (
      kycButton.textContent === "Initialize" ||
      kycButton.textContent === "초기화"
    ) {
      await initializeStatus();
    } else {
      const emailValue = emailInput.value;
      if (validateEmail(emailValue)) {
        gtag("event", "click_kyc_email_verify​", {});

        const response = await fetchTwalletKycUser(emailValue);
        console.log(`response: ${JSON.stringify(response)}`);

        if (browserLanguage && !browserLanguage.includes("ko")) {
          document.querySelector(".kyc-button").textContent = "Initialize";
        } else {
          document.querySelector(".kyc-button").textContent = "초기화";
        }

        emailInput.disabled = true;
        emailInput.style.cursor = "not-allowed";
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const status = data.status;

      console.log(`data: ${JSON.stringify(data)}`);

      document.querySelector(".terms-container").style.display = "none";
      document.querySelector(".email-input-container").style.display = "none";
      document.querySelector(".email-button-container").style.display = "none";

      const statusContainer = document.getElementById("status-container");
      const resetMessage = document.createElement("div");

      resetMessage.style.padding = "20px";
      resetMessage.style.width = "100%";
      resetMessage.style.boxSizing = "border-box";
      resetMessage.style.position = "fixed";
      resetMessage.style.bottom = "28px";
      resetMessage.style.left = "0px";
      resetMessage.style.textAlign = "center";
      resetMessage.style.fontSize = "14px";
      resetMessage.style.color = "#666";
      resetMessage.style.lineHeight = "22px";
      resetMessage.style.wordBreak = "keep-all";
      resetMessage.style.fontWeight = "500";

      if (browserLanguage && !browserLanguage.includes("ko")) {
        resetMessage.innerHTML =
          'If&nbsp;you&nbsp;failed&nbsp;verification&nbsp;or wish&nbsp;to&nbsp;restart, please&nbsp;<span id="reset-link" style="text-decoration: underline; color: #3617ce; text-underline-offset: 4px; cursor: pointer">proceed&nbsp;again</span>.';
      } else {
        resetMessage.innerHTML =
          '인증에 실패했거나 처음부터 다시 인증 진행을 원하시면 <span id="reset-link" style="text-decoration: underline; color: #3617ce; text-underline-offset: 4px; cursor: pointer">인증을 다시 진행</span> 해주세요.';
      }

      if (
        status === "requested" ||
        status === "pending" ||
        status === "faceauthRequested"
      ) {
        gtag("event", "page_kyc_pending​", {});

        showStatusComponent("Standby");
      } else if (
        status === "rejected" ||
        status === "emailExpired" ||
        status === "faceauthRejected"
      ) {
        gtag("event", "page_kyc_fail​", {});

        showStatusComponent("Rejected");
      } else if (status === "emailRequested") {
        gtag("event", "page_kyc_approval​", {});

        showStatusComponent("AuthentificationStanby");
      } else if (
        status === "emailApproved" ||
        status === "faceauthApproved" ||
        status === "walletCreated"
      ) {
        gtag("event", "page_kyc_email_request​", {});

        showStatusComponent("AuthentificationApproved");
      }

      statusContainer.appendChild(resetMessage);

      document
        .getElementById("reset-link")
        .addEventListener("click", async () => {
          gtag("event", "click_kyc_reset​", {});

          await initializeStatus();
        });
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
                <div class="kyc-status-title">Waiting for&nbsp;KYC&nbsp;verification.</div>
                <div class="kyc-status-text">Even&nbsp;if you&nbsp;leave the&nbsp;screen, the&nbsp;progress&nbsp;will&nbsp;be&nbsp;maintained.</div>
            </div>
            `;
      } else {
        statusContainer.innerHTML = `
            <div class="kyc-status-container">
                <img src=${loadingAnimation} alt="Loading" />
                <div class="kyc-status-title">KYC 인증을 대기하고 있어요.</div>
                <span class="kyc-status-text">화면을&nbsp;나가더라도 진행&nbsp;상태는&nbsp;유지됩니다.</span>                
            </div>
            `;
      }
    } else if (status === "Rejected") {
      if (browserLanguage && !browserLanguage.includes("ko")) {
        statusContainer.innerHTML = `
            <div class="kyc-status-container">
                <img src=${closeImage} alt="Close" />
                <div class="kyc-status-title">KYC verification failed.</div>
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
            <div class="email-button-container">
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
            <div class="email-button-container">
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
            <div class="email-button-container">
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
            <div class="email-button-container">
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
            gtag("event", "click_kyc_email_request_btn​", {});

            eventToken = await fetchTwalletEventToken(accessToken);
          }

          if (accessToken && eventToken) {
            showStatusComponent("Created");
          }
        });
    } else if (status === "Created") {
      gtag("event", "page_kyc_success​", {});

      if (browserLanguage && !browserLanguage.includes("ko")) {
        statusContainer.innerHTML = `
          <div class="kyc-status-container">
            <img src=${successImage} alt="Done" />
            <div class="kyc-status-title">T wallet is connected successfully.</div>
          </div>
          <div class="email-button-container">
            <button class="kyc-button active" id="redirect-kyc-wallet-button">Confirm</button>
          </div>
          `;
      } else {
        statusContainer.innerHTML = `
          <div class="kyc-status-container">
            <img src=${successImage} alt="Done" />
            <div class="kyc-status-title">T wallet 연결에 성공했어요.</div>            
          </div>
          <div class="email-button-container">
            <button class="kyc-button active" id="redirect-kyc-wallet-button">확인</button>
          </div>
          `;
      }

      document
        .getElementById("redirect-kyc-wallet-button")
        .addEventListener("click", async () => {
          gtag("event", "click_kyc_sucess_btn​", {});

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        sessionStorage.setItem("event-token", data.event_token);
        return data.event_token;
      }
    } catch (error) {
      console.error("Error fetching token event:", error);
      /* if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      } */
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
      /* if (browserLanguage && !browserLanguage.includes("ko")) {
        showPopup("The network connection is unstable.");
      } else {
        showPopup("네트워크 연결이 불안정해요.");
      } */
    }
  }
});
