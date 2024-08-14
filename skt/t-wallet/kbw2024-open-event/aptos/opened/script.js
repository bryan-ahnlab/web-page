document.addEventListener("DOMContentLoaded", function () {
  /*  */
  const connectWalletButton = document.getElementById("connect-wallet");

  if (connectWalletButton) {
    connectWalletButton.addEventListener("click", function () {
      const textToCopy = "https://example.com/invite"; // 복사할 텍스트를 여기에 설정하세요.

      // 클립보드에 텍스트 복사
      navigator.clipboard.writeText(textToCopy).then(
        function () {
          // 성공적으로 복사되었을 때
          console.log("A");

          // 버튼의 텍스트를 변경합니다.
          connectWalletButton.innerHTML = `    
          <span class="content-event-button-text">친구 초대 링크 복사하기</span>
        `;

          // 툴팁 형태의 메시지 표시
          showTooltip(connectWalletButton, "복사되었습니다.");
        },
        function (err) {
          // 복사 실패 시
          console.error("클립보드에 복사할 수 없습니다.", err);
        }
      );
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
    tooltip.style.top = `${element.offsetTop - 40}px`; // 버튼 위에 툴팁을 위치시킴
    tooltip.style.left = `${element.offsetLeft}px`;

    // 툴팁을 DOM에 추가합니다.
    document.body.appendChild(tooltip);

    // 2초 후 툴팁 제거
    setTimeout(() => {
      tooltip.remove();
    }, 2000);
  }

  /*  */

  const canvas = document.getElementById("rouletteCanvas");
  const spinButton = document.getElementById("spinButton");
  const selector = document.getElementById("selector");

  const tempAssetsPath = "./assets/images/";
  const images = {
    roulette_6: tempAssetsPath + "aptos_03.svg",
    roulette_5: tempAssetsPath + "aptos_02.svg",
    roulette_4: tempAssetsPath + "aptos_01.svg",
    roulette_3: tempAssetsPath + "aptos_03.svg",
    roulette_2: tempAssetsPath + "aptos_02.svg",
    roulette_1: tempAssetsPath + "aptos_01.svg",
    icoDownArrowRed: tempAssetsPath + "roulette_arrow.svg",
  };

  const list = [
    { id: "roulette_6", image: images.roulette_6, text: "0.3 APT" },
    { id: "roulette_5", image: images.roulette_5, text: "0.2 APT" },
    { id: "roulette_4", image: images.roulette_4, text: "0.1 APT" },
    { id: "roulette_3", image: images.roulette_3, text: "0.3 APT" },
    { id: "roulette_2", image: images.roulette_2, text: "0.2 APT" },
    { id: "roulette_1", image: images.roulette_1, text: "0.1 APT" },
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
    const canvasSize = 400;
    const arrowLocation = (canvasSize / 400) * 1;
    const arrowSize = (canvasSize / 400) * 50;
    const radiusSize = (canvasSize / 400) * 85;
    const radiusPadding = (radiusSize / 85) * 90;
    const pieceImageSize = (canvasSize / 250) * 24;

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
      ctx.strokeStyle = "#3617CD";
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
        ctx.drawImage(img, -pieceImageSize / 2, -pieceImageSize / 2, 38, 47);
        ctx.restore();
      };
    }
  };

  const fetchSpinResult = async () => {
    try {
      const response = await fetch("https://example.com/api/spinResult");
      const data = await response.json();
      return data.winningIndex;
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
