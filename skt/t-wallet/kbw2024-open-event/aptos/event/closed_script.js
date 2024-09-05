document.addEventListener("DOMContentLoaded", async function () {
  accessToken = sessionStorage.getItem("access-token");
  eventToken = sessionStorage.getItem("event-token");

  if (accessToken && eventToken) {
    loginType = sessionStorage.getItem("login-type");
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
    document.querySelector(".title-event-text-3").innerHTML =
      "2024.&nbsp;9.&nbsp;1.(Sun)&nbsp;~&nbsp;9.&nbsp;30.(Mon)";
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

  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  const popupContent = document.getElementById("event-description");

  if (isMobile) {
    popupContent.style.padding = `0px 5px 0px 25px`;
  } else {
    popupContent.style.margin = `0px 15px 0px 35px`;
  }

  /*  */

  populateRankingTable(data.rankings);

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

      row.appendChild(rankCell);
      row.appendChild(addressCell);
      row.appendChild(countCell);
      row.appendChild(rewardCell);

      rankingTableBody.appendChild(row);
    });
  }
});
