angular.module('myApp', ['ngTable'])
  .controller('ParticipantCtrl', function ($scope, $http, NgTableParams) {
    // $scope.baseUrl = 'http://localhost/ppsr/api/v1';
    $scope.baseUrl = 'https://adelaidedenim.com/ppsr/api/v1';
    $scope.loading = false;

    $scope.table = new NgTableParams({
      count: 10,
      page: 1
    }, {
        getData: getData
      });

    function getData(params) {
      var npm = params.filter().npm ? params.filter().npm : '';
      return $http.get($scope.baseUrl + '/participants/data.php?page=' + params.page() + '&limit=' + params.count() + '&npm=' + npm).then(function (response) {
        params.total(response.data.total);
        return response.data.data;
      }).catch(function (err) {
        console.log('err', err);
      });
    }

    $scope.onConfirmPayment = function (peserta) {
      if (peserta.npm === '') return;
      $scope.loading = true;
      if (confirm('Apakah Kamu Yakin ingin Mengkonfirmasi Peserta Tersebut ? Cek Kembali Sebelum Memproses!!')) {
        $http.post($scope.baseUrl + '/participants/update-paid.php', {
          npm: peserta.npm,
          value: 'Y'
        }).then(function (response) {
          $scope.table.reload();
          if (response.data.success) {
            alert('Berhasil Mengkonfirmasi Status Pembayaran!');
          } else {
            alert('Maaf Gagal Mengkonfirmasi Status Bayar!');
          }
          $scope.loading = false;
        }).catch(function (err) {
          if (err) alert('Oooppsss..!! Ada Masalah Saat Menghubungkan Ke Server!');
          $scope.loading = false;
        });
      }
    };

    $scope.onCancelPayment = function (peserta) {
      if (peserta.npm === '') return;
      $scope.loading = true;
      if (confirm('Apakah Kamu Yakin ingin Membatalkan Konfirmasi Peserta Tersebut ? Cek Kembali Sebelum Memproses!!')) {
        $http.post($scope.baseUrl + '/participants/update-paid.php', {
          npm: peserta.npm,
          value: 'N'
        }).then(function (response) {
          $scope.table.reload();
          if (response.data.success) {
            alert('Berhasil Membatalkan Konfirmasi Status Pembayaran!');
          } else {
            alert('Maaf Gagal Membatalkan Konfirmasi Status Bayar!');
          }
          $scope.loading = false;
        }).catch(function (err) {
          if (err) alert('Oooppsss..!! Ada Masalah Saat Menghubungkan Ke Server!');
          $scope.loading = false;
        })
      }
    };
  });