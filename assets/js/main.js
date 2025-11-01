// Bu kod, tüm HTML dokümanı (index.html) yüklendiğinde çalışmaya başlar.
document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * Bu bizim GENEL render (ekrana basma) fonksiyonumuz.
     * Hangi veri dizisini (örn: çorbalar dizisi) ve 
     * HTML'deki hangi ID'li alana basılacağını (örn: 'corbalar-listesi') parametre olarak alır.
     */
    function renderKategori(urunDizisi, elementId) {
        
        // 1. HTML'de verilerin basılacağı konteyner elementi bul
        const listeElementi = document.getElementById(elementId);

        // 2. O elementin varlığını kontrol et
        if (!listeElementi) {
            console.error(`Hata: "${elementId}" ID'li element HTML'de bulunamadı.`);
            return; // Bulamazsa fonksiyonu durdur
        }

        // 3. HTML içeriğini oluşturmak için boş bir değişken başlat
        let htmlIcerik = '';
        
        // 4. Bize verilen 'urunDizisi'ndeki her bir 'urun' için döngüye gir
        urunDizisi.forEach(urun => {
            // ve o ürün için HTML kartını oluştur
            htmlIcerik += `
                <div class="urun-karti">
                    <img src="${urun.resim_url}" alt="${urun.ad}">
                    <div class="urun-karti-icerik">
                        <h3>${urun.ad}</h3>
                        <p>${urun.aciklama}</p>
                        <span class="fiyat">${urun.fiyat} TL</span>
                    </div>
                </div>
            `;
        });

        // 5. Oluşan tüm HTML'i, bulduğumuz konteyner elementinin içine bas
        listeElementi.innerHTML = htmlIcerik;
    }

    /**
     * Bu bizim ana fonksiyonumuz. JSON'u SADECE BİR KEZ çeker
     * ve veriyi ilgili render fonksiyonlarına dağıtır.
     */
    function menuyuYukle() {
        
        fetch('assets/data/menu.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // JSON verisi 'data' değişkenine geldi. Şimdi dağıtım zamanı.
                
                // 1. Çorbaları render et
                // data.corbalar dizisini al, 'corbalar-listesi' ID'li alana bas
                renderKategori(data.corbalar, 'corbalar-listesi');
                
                // 2. Ana Yemekleri render et 
                // data.ana_yemekler dizisini al, 'ana-yemekler-listesi' ID'li alana bas
                renderKategori(data.ana_yemekler, 'ana-yemekler-listesi');
                // 3. İçecekleri render et
                // data.icecekler dizisini al, 'icecekler-listesi' ID'li alana bas
                renderKategori(data.icecekler, 'icecekler-listesi');
               
            })
            .catch(error => {
                // Bir hata olursa konsola yazdır
                console.error('Menü yüklenirken bir hata oluştu:', error);
            });
    }

    // Ana fonksiyonu çağırarak tüm menüyü yüklemeyi başlat
    menuyuYukle();

});