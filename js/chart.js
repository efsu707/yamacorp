// Google Charts をロード
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

// ▼ スプレッドシート設定
const SPREADSHEET_ID = '1bioT0zhf6akhq2TBiZRL-P34GN1CA7jUaZbg6VHC2sU';
const SHEET_NAME = 'point';

let originalRawData = null; // 元データ保持用

// メイン描画関数
function drawChart() {
  const spreadsheetUrl =
    `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=${encodeURIComponent(SHEET_NAME)}`;

  const query = new google.visualization.Query(spreadsheetUrl);
  query.send(handleResponse);
}

// レスポンス処理
function handleResponse(response) {
  if (response.isError()) {
    console.error('データ取得エラー:', response.getMessage());
    return;
  }

  originalRawData = response.getDataTable();

  // 初期表示：1か月
  drawFilteredChart("1m");
}

// ▼ 期間フィルタリングしてグラフ描画（累積しない）
function drawFilteredChart(range) {
  if (!originalRawData) return;

  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case "1w":
      startDate.setDate(now.getDate() - 7);
      break;
    case "1m":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "3m":
      startDate.setMonth(now.getMonth() - 3);
      break;
    case "1y":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  // ▼ 新しいデータテーブル（累積なし）
  const data = new google.visualization.DataTable();
  data.addColumn('date', '日付');
  data.addColumn('number', 'ポイント');

  for (let i = 0; i < originalRawData.getNumberOfRows(); i++) {
    const date = originalRawData.getValue(i, 0);
    const point = originalRawData.getValue(i, 1) || 0;

    if (date >= startDate) {
      data.addRow([date, point]);
    }
  }

  const options = {
    title: 'ポイント推移（山岸コーポレーション）',
    colors: ['#005BAC'],
    backgroundColor: '#f7f9fc',
    legend: { position: 'bottom' },
    curveType: 'function',
    width: '100%',
    height: 400,
    hAxis: {
      format: 'MM/dd',
      gridlines: { count: 10 }
    }
  };

  const chart = new google.visualization.LineChart(document.getElementById('chart'));
  chart.draw(data, options);
}

// ▼ ボタンから呼び出す関数
window.changeRange = function(range) {
  drawFilteredChart(range);
};

// ▼ 一定間隔で再描画（リアルタイム更新）
const REFRESH_INTERVAL_MS = 60000; // 60秒
setInterval(drawChart, REFRESH_INTERVAL_MS);