let browserLanguage = "ko";

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
    document.getElementById("title-event-text-1").src =
      "./assets/images/title_event_text_en_1.svg";
    document.getElementById("title-event-text-2").src =
      "./assets/images/title_event_text_en_2.svg";
    document.getElementById("title-event-image").src =
      "./assets/images/title_event_closed_en_image.svg";
    document.getElementById("content-event-text-1").innerHTML =
      "The&nbsp;Season&nbsp;3&nbsp;Event has&nbsp;been";
    document.getElementById("content-event-text-2").innerHTML =
      "successfully completed";
    document.getElementById("event-message-1").innerHTML =
      "Thank you to all who participated in the event. Here are the details regarding the event’s conclusion and the distribution of rewards.";

    document.getElementById("event-description-1").innerHTML =
      "The top Inviter event was completed as of September 5, 2024, and the distribution of rewards for the top Inviter ranking has been confirmed.";
    document.getElementById("event-description-2").innerHTML =
      "Customers who spun the roulette after the event ended, due to time differences, will not receive rewards.";
    document.getElementById("event-description-3").innerHTML =
      "All top inviter event rewards will be awarded at 00:00 on September 7th, 2024.";

    document.getElementById("event-message-2").innerHTML =
      "We apologize for any inconvenience caused by certain aspects of the event not running as smoothly as expected. We will strive to provide better service in the future. We appreciate your continued interest in our upcoming seasonal events.";
    document.getElementById("event-message-3").innerHTML = "";

    document.getElementById("balance-text-1").textContent =
      "Check $APT you've claimed:";
    document.getElementById("twallet-link").textContent = "T wallet";
    document.getElementById("abcwallet-link").textContent = "ABC Wallet";

    document.getElementById("ranking-title").textContent = "Top 100 Inviters";
    document.getElementById("rank-header").textContent = "Rank";
    document.getElementById("wallet-header").textContent = "Wallet Address";
    document.getElementById("invite-header").textContent = "Invites";
    document.getElementById("extra-header").textContent = "Extra Rewards";
  }

  await detectLangauge();

  /*  */

  const popupContent = document.getElementById("event-description");

  popupContent.style.padding = `0px 15px 0px 35px`;
  popupContent.style.maxWidth = `455px`;

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
