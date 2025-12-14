// Google Charts をロード
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

// ▼ 必要に応じてここを編集
const SPREADSHEET_ID = '1bioT0zhf6akhq2TBiZRL-P34GN1CA7jUaZbg6VHC2sU';
const SHEET_NAME = 'point';

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

  const rawData = response.getDataTable();

  // ▼ 累積ポイント用の新しいデータテーブルを作成
  const data = new google.visualization.DataTable();
  data.addColumn('string', '日付');
  data.addColumn('number', '累積ポイント');

  let cumulative = 0;

  for (let i = 0; i < rawData.getNumberOfRows(); i++) {
    const date = rawData.getValue(i, 0);       // A列：日付
    const point = rawData.getValue(i, 1) || 0; // B列：その日のポイント

    cumulative += point;

    data.addRow([date, cumulative]);
  }

  const options = {
    title: '累積ポイント推移（山岸コーポレーション）',
    colors: ['#005BAC'],
    backgroundColor: '#f7f9fc',
    legend: { position: 'bottom' },
    curveType: 'function',
    width: '100%',
    height: 400
  };

  const chart = new google.visualization.LineChart(document.getElementById('chart'));
  chart.draw(data, options);
}

// ▼ 一定間隔で再描画（リアルタイム更新）
const REFRESH_INTERVAL_MS = 60000; // 60秒
setInterval(drawChart, REFRESH_INTERVAL_MS);