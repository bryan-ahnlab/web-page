const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mjg2OTc1NzAsImlhdCI6MTcyMzUwOTY3MCwic3ViIjp7InVzZXJfaWQiOiI4ZGYxZjcxZi0zNDY0LTRmODItYjZjYS01OWQ3ZWIyNDMyNDMiLCJvbGRfdXNlcl9pZCI6IjM4OWRkNDcyLTQ2MTUtNDkwYy1iMjhlLTkzMWM0NmYwNTIwYiIsImFiY191aWQiOiI0NzAwMjFmZGM5NDU0NzEzOTZhOWUxNmFiMzIwYzAxNyIsImVtYWlsIjoic3R3a3R3dm4rMTNAZ21haWwuY29tIiwibmlja19uYW1lIjpudWxsLCJwaG90b191cmwiOm51bGwsImV2bV9hY2NvdW50IjpbeyJpZCI6ImNlODA1OTViLTQ5NmItNGJlMy04ZTM1LTc4OGQ0YmEwMGM4MCIsInVzZXJfaWQiOiI4ZGYxZjcxZi0zNDY0LTRmODItYjZjYS01OWQ3ZWIyNDMyNDMiLCJhZGRyZXNzIjoiMHgxMTlkODRBNjhDMDk4ZTUzM0MzMGQzNTE2RkFkZDczQWZCRDExZDNiIiwicHVia2V5IjoiMHgwMzQ2ODM4NGI3MzI5NjU3ZGYxNTI1YWFkNmRkNmJlOGU5YmNjMGMwOTcyZDg5ZmIyMDA4MDdiNWZhODY1MmJhZDUiLCJtcGMiOiJkZWtleSIsIndhbGxldCI6InQiLCJjcmVhdGVkX2F0IjoiMjAyNC0wOC0xMlQwNjozMjowNi4zMzk3NzUiLCJ1cGRhdGVkX2F0IjoiMjAyNC0wOC0xMlQwNjozMjowNi4zMzk3NzUiLCJleHRyYV9pbmZvIjpudWxsfSx7ImlkIjoiMjhjZWFjODUtYzE4OS00ODczLWFmYTUtYmM0MjVjY2RmYjY5IiwidXNlcl9pZCI6IjhkZjFmNzFmLTM0NjQtNGY4Mi1iNmNhLTU5ZDdlYjI0MzI0MyIsImFkZHJlc3MiOiIweDY0OTM1YTk1NzE3ZTM2MDFBQmQ2MDQ3MjVkNzczRWVhNDQ4NTZCY0IiLCJwdWJrZXkiOiIweDAyZmU5ZDllY2Q2NmI0ZGMyNGY3YzJmM2U4Y2ZkZGE1MzI4YThhYjk3MGZmNjkwYjVkMjJlYTJiY2IwYTcyYzk4MyIsIm1wYyI6ImRla2V5Iiwid2FsbGV0IjoiYWJjIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDgtMDJUMTM6NTM6MDQuNjAwODc4IiwidXBkYXRlZF9hdCI6IjIwMjQtMDgtMDJUMTM6NTM6MDQuNjAwODc4IiwiZXh0cmFfaW5mbyI6bnVsbH1dLCJhcHRvc19hY2NvdW50IjpbeyJpZCI6ImE2NjBjZDE1LTVlY2QtNGU0OS1iZDQ5LTljNjM5Y2ZkMjU0YiIsInVzZXJfaWQiOiI4ZGYxZjcxZi0zNDY0LTRmODItYjZjYS01OWQ3ZWIyNDMyNDMiLCJhZGRyZXNzIjoiMHgwYmViNTA2MTk0MWYxODk5YTA0ZTNhYTRjOWVhZjEzZDJlZmZmOWUyNGRkNzllZDMxN2RhMDVjYWZjMWFmNDhiIiwicHVia2V5IjoiMHgwMmZlOWQ5ZWNkNjZiNGRjMjRmN2MyZjNlOGNmZGRhNTMyOGE4YWI5NzBmZjY5MGI1ZDIyZWEyYmNiMGE3MmM5ODMiLCJtcGMiOiJkZWtleSIsIndhbGxldCI6ImFiYyIsImNyZWF0ZWRfYXQiOiIyMDI0LTA4LTAyVDEzOjUzOjA0LjgwNjU2MSIsInVwZGF0ZWRfYXQiOiIyMDI0LTA4LTAyVDEzOjUzOjA0LjgwNjU2MSIsImV4dHJhX2luZm8iOm51bGx9LHsiaWQiOiI3Mjk4Zjc1NC0yYjkwLTQ4MjUtODNkZC1hZDFhMTk5MjA2NDIiLCJ1c2VyX2lkIjoiOGRmMWY3MWYtMzQ2NC00ZjgyLWI2Y2EtNTlkN2ViMjQzMjQzIiwiYWRkcmVzcyI6IjB4ODZjOTY3MWNmMjQ2ZGMyNDQ5MzVlMDMxM2Y2MjQ4ZmNkMTJjNmYxYzdiMWFhMDM1ZTcyM2Y2MDlkMzM2NGZmNiIsInB1YmtleSI6IjB4MDM0NjgzODRiNzMyOTY1N2RmMTUyNWFhZDZkZDZiZThlOWJjYzBjMDk3MmQ4OWZiMjAwODA3YjVmYTg2NTJiYWQ1IiwibXBjIjoiZGVrZXkiLCJ3YWxsZXQiOiJ0IiwiY3JlYXRlZF9hdCI6IjIwMjQtMDgtMTJUMDY6MzI6MDYuNTA0NTc2IiwidXBkYXRlZF9hdCI6IjIwMjQtMDgtMTJUMDY6MzI6MDYuNTA0NTc2IiwiZXh0cmFfaW5mbyI6bnVsbH1dLCJidGNfYWNjb3VudCI6W3siaWQiOiIwZjljMGExYy0wMzI0LTQ0NGMtOWUzNy00OTUzZGY5Mzg0YTEiLCJ1c2VyX2lkIjoiOGRmMWY3MWYtMzQ2NC00ZjgyLWI2Y2EtNTlkN2ViMjQzMjQzIiwiYWRkcmVzcyI6ImJjMXFjcTczMmp5bXNlZjY3emRnNHh1emdmNXhkZHlmOGhrOHl6bmtkeiIsInB1YmtleSI6IjB4MDJmZTlkOWVjZDY2YjRkYzI0ZjdjMmYzZThjZmRkYTUzMjhhOGFiOTcwZmY2OTBiNWQyMmVhMmJjYjBhNzJjOTgzIiwibXBjIjoiZGVrZXkiLCJ3YWxsZXQiOiJhYmMiLCJjcmVhdGVkX2F0IjoiMjAyNC0wOC0wMlQxMzo1MzowNC43OTY3MzEiLCJ1cGRhdGVkX2F0IjoiMjAyNC0wOC0wMlQxMzo1MzowNC43OTY3MzEiLCJleHRyYV9pbmZvIjp7Im5hdGl2ZV9zZWd3aXRfYWRkcmVzcyI6ImJjMXFjcTczMmp5bXNlZjY3emRnNHh1emdmNXhkZHlmOGhrOHl6bmtkeiJ9fV0sImNyZWF0ZWRfYXQiOiIyMDI0LTA4LTAyVDEzOjUzOjA0LjI4NjI3NSIsInVwZGF0ZWRfYXQiOiIyMDI0LTA4LTAyVDEzOjUzOjA0LjI4NjI3NSIsImV4dHJhX2luZm8iOm51bGx9fQ.u5czcO9LjOINV4pbNC61r3YjM84DSc-8X4RmjT7qgBA";

let isLogined = false;
let isVerified = false;

document.addEventListener("DOMContentLoaded", function () {
  /*  */
  const connectWalletButton = document.getElementById("connect-wallet");

  function handleLoginStatusChange() {
    const inviteCodeContainer = document.getElementById("invite-code-pannel");

    if (isLogined) {
      inviteCodeContainer.style.display = "flex";
    } else {
      inviteCodeContainer.style.display = "none";
    }
  }

  /*  */

  if (connectWalletButton) {
    connectWalletButton.addEventListener("click", function () {
      if (!isLogined) {
        console.log("A");

        // 버튼의 텍스트를 "친구 초대 링크 복사하기"로 변경
        connectWalletButton.innerHTML = `    
          <span class="content-event-button-text">친구 초대 링크 복사하기</span>
        `;

        // 상태를 true로 변경하여 이후 클릭 시 복사 기능이 동작하도록 설정
        isLogined = true;

        handleLoginStatusChange();
      } else {
        // 상태가 true일 때 (즉, 두 번째 클릭부터) 클립보드 복사 기능 동작
        const textToCopy = "https://example.com/invite"; // 복사할 텍스트를 설정

        navigator.clipboard.writeText(textToCopy).then(
          function () {
            // 성공적으로 복사되었을 때 툴팁 표시
            showTooltip(connectWalletButton, "복사되었습니다.");
          },
          function (err) {
            // 복사 실패 시
            console.error("클립보드에 복사할 수 없습니다.", err);
          }
        );
      }
    });
  } else {
    console.error("connect-wallet 버튼을 찾을 수 없습니다.");
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
    const tooltipWidth = tooltip.offsetWidth;

    // 버튼의 중앙에 위치시키고, 아래로 5px 간격
    tooltip.style.top = `${window.scrollY + elementRect.bottom + 5}px`;
    tooltip.style.left = `${
      window.scrollX +
      elementRect.left +
      elementRect.width / 2 -
      tooltipWidth / 2
    }px`;

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
    document.body.appendChild(tooltip);

    // 툴팁이 DOM에 추가된 후에 너비를 계산해야 합니다.
    tooltip.style.left = `${
      window.scrollX +
      elementRect.left +
      elementRect.width / 2 -
      tooltip.offsetWidth / 2
    }px`;

    /* tooltip.style.top = `${element.offsetTop + 65}px`; // 버튼 위에 툴팁을 위치시킴
    tooltip.style.left = `${element.offsetLeft}px`; */

    // 툴팁을 DOM에 추가합니다.
    document.body.appendChild(tooltip);

    // 2초 후 툴팁 제거
    setTimeout(() => {
      tooltip.remove();
    }, 2000);
  }

  /*  */

  const inviteCodeButton = document.getElementById("verify-invite-code");

  if (inviteCodeButton) {
    inviteCodeButton.addEventListener("click", function () {
      const inviteCodeInput = document.querySelector(".invite-code-input");
      const inviteCodeText = document.querySelector(".invite-code-text");
      const inviteCodeButton = document.querySelector(".invite-code-button");
      const inviteCodeContainer = document.getElementById("invite-code-pannel");

      // 초대 코드 유효성 검사
      const codePattern = /^[A-Z0-9]{8}$/; // 영대문자, 숫자만 허용, 최대 8자

      if (!codePattern.test(inviteCodeInput.value)) {
        isVerified = false;
      } else {
        isVerified = true;
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
          messageElement.textContent = "코드를 다시 확인해주세요.";
          messageElement.style.color = "#FF0000"; // 빨간색 텍스트
          messageElement.style.marginTop = "10px"; // 약간의 여백 추가
          messageElement.style.marginLeft = "10px"; // 약간의 여백 추가
          messageElement.style.display = "block";
          messageElement.id = "verify-error-message"; // id 설정

          inviteCodeContainer.appendChild(messageElement);
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
    const radiusPadding = (radiusSize / 85) * 95;
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

  const fetchSpinResult = async () => {
    try {
      /* const response = await fetch(
        "https://dev-kbw-event.myabcwallet.com/v1/event/user",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",            
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Spin result data:", data);

      /* return data.winningIndex; */
      return null;
    } catch (error) {
      console.error("Error fetching spin result:", error);
      return null;
    }
  };

  const spin = async () => {
    spinning = true;
    updateButtonState();

    const randomSpin = Math.floor(Math.random() * list.length);
    let winningIndex = await fetchSpinResult();

    if (winningIndex === null) {
      winningIndex = randomSpin;
    }

    const spins = 30;
    const degreesPerSpin = 360;
    const degreesPerOption = 360 / list.length;
    const rotationForFixedResult = winningIndex * degreesPerOption;
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

  const getResult = (finalAngle) => {
    const degreesPerOption = 360 / list.length;
    const adjustedAngle = (360 - finalAngle + degreesPerOption / 2) % 360;
    let winningIndex =
      Math.floor(adjustedAngle / degreesPerOption) % list.length;

    if (winningIndex === 0) {
      winningIndex = list.length - 1;
    } else {
      winningIndex -= 1;
    }

    const selectedItem = list[winningIndex];
    if (selectedItem) {
      alert(`Congratulations! ${selectedItem.text}!`);
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

  spinButton.addEventListener("click", () => {
    if (!spinning) {
      spin();
    }
  });

  updateCanvasSize();
});
