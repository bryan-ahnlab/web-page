document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("rouletteCanvas");
  const spinButton = document.getElementById("spinButton");
  const selector = document.getElementById("selector");

  const tempAssetsPath =
    "file:///Users/bryan/Workspace/web-page/web-page/skt/t-wallet/kbw2024-open-event/opened/assets/";
  const images = {
    arb: tempAssetsPath + "arb.png",
    bnb: tempAssetsPath + "bnb.png",
    eth: tempAssetsPath + "eth.png",
    klay: tempAssetsPath + "klay.png",
    matic: tempAssetsPath + "matic.png",
    opt: tempAssetsPath + "opt.png",
    icoDownArrowRed: tempAssetsPath + "ico_down_arrow_red.png",
  };

  const list = [
    { id: "arb", image: images.arb, text: "Arbitrum" },
    { id: "bnb", image: images.bnb, text: "Binance Smart Chain" },
    { id: "eth", image: images.eth, text: "Ethereum" },
    { id: "klay", image: images.klay, text: "Klaytn" },
    { id: "matic", image: images.matic, text: "Polygon" },
    { id: "opt", image: images.opt, text: "Optimism" },
  ];

  const colors = ["red", "orange", "yellow", "green", "blue", "purple"];

  let rotate = 0;
  let easeOut = 3;
  let spinning = false;

  const updateCanvasSize = () => {
    const canvasSize = 400;
    const arrowLocation = (canvasSize / 400) * 8;
    const arrowSize = (canvasSize / 400) * 60;
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
        ctx.drawImage(
          img,
          -pieceImageSize / 2,
          -pieceImageSize / 2,
          pieceImageSize,
          pieceImageSize
        );
        ctx.restore();
      };
    }
  };

  const spin = async () => {
    spinning = true;
    updateButtonState();

    const spins = 20;
    const degreesPerSpin = 360;
    const randomSpin = Math.floor(Math.random() * list.length);
    const degreesPerOption = 360 / list.length;
    const rotationForFixedResult = randomSpin * degreesPerOption;
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
