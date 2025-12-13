window.onload = () => {
  // ヒーローアニメーション
  const heroText = document.querySelector(".hero-h1");
  const heroBtn = document.querySelector(".hero-btn");

  setTimeout(() => heroText.classList.add("show"), 300);

  // メニュー開閉
  const menuToggle = document.querySelector(".menu-toggle");
  const sideMenu = document.querySelector(".side-menu");
  const closeBtn = document.querySelector(".close-btn");

  menuToggle.addEventListener("click", () => {
    sideMenu.classList.add("open");
  });

  closeBtn.addEventListener("click", () => {
    sideMenu.classList.remove("open");
  });

  // フォーム送信
  document.querySelector("form").addEventListener("submit", () => {
    alert("お問い合わせありがとうございます！");
  });
};

// Google Chartsライブラリをロード
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  // 公開したGoogleスプレッドシートのURLを指定
  // 【シートID】と【シート名】を実際のものに置き換えてください
  var query = new google.visualization.Query(
    'https://docs.google.com/spreadsheets/d/【シートID】/gviz/tq?sheet=【シート名】'
  );

  query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
  if (response.isError()) {
    console.error('エラー: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();
  var options = {
    title: '最新データグラフ',
    width: '100%',
    height: 400,
    legend: { position: 'bottom' },
    hAxis: { title: '項目' },
    vAxis: { title: '値' }
  };

  // 折れ線グラフを描画（必要に応じて BarChart や PieChart に変更可能）
  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}