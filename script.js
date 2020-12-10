// Format a nuber with suffix letter
function formatNumber(labelValue) {
  return Math.abs(Number(labelValue)) >= 1.0e+9
    ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
  : Math.abs(Number(labelValue)) >= 1.0e+6
    ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
  : Math.abs(Number(labelValue)) >= 1.0e+3
    ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"
  : Math.abs(Number(labelValue));
}

var vm = new Vue({
  el: 'main',

  data: {
    search: '',
    selectedName: '',
    selectedCode: '',
    selectedCapital: '',
    selectedLanguage: '',
    selectedCurrency: '',
    selectedLatlng: '',
    selectedLatlngUrl: '',
    selectedPopulation: '',
    selectedArea: '',
    selectedSubregion: '',
    selectedGini: '',
    selectedTimezone: '',
    selectedFlagSrc: '',
  },

  computed: {
    countries () {
      var self = this;
      var countries;

      // Get JSON from API
      $.ajax({
        url: 'https://restcountries.eu/rest/v2/all',
        async: false,
        success: function(data){
          countries = data;
        }
      });

      // Filter search by country name in all languages
      countries = countries.filter(function(value, index, array) {
        return value['name'].toLowerCase().includes(self.search.toLowerCase())
        || Object.values(value['translations']).join(' ').toLowerCase().includes(self.search.toLowerCase());
      });

      return countries;
    },
  },

  // Select first country in list on load
  beforeMount() {
    var self = this;
    var found = false;
    this.countries.forEach(function(element) {
      if(element['alpha2Code'] === 'US') {
        self.selectCountry(element);
        found = true;
      }
    });
    if(!found)
        this.selectCountry(this.countries[0]);
  },

  methods: {
    // Returns country name
    getName (country) {
      return country['name'];
    },

    // Returns country flag URL
    getFlagSrc (country) {
      return (country['flag'] || 'N/A');
    },

    // Set country data
    selectCountry (country) {
      var self = this;

      $('section').animate({
        opacity: 0
      }, 150, function() {

        self.selectedName = (country['name'] || 'N/A');
        self.selectedFlagSrc = self.getFlagSrc(country);
        self.selectedCode = (country['alpha2Code'] || 'N/A') + ' / ' + (country['alpha3Code'] || 'N/A');
        self.selectedCapital = (country['capital'] || 'N/A');

        var arrayLanguage = [];
        country['languages'].forEach(function(element) {
          arrayLanguage.push(element['name']);
        });
        self.selectedLanguage = (country['languages'].length > 0) ? arrayLanguage.join(', ') : 'N/A';

        var arrayCurrency = [];
        country['currencies'].forEach(function(element) {
          arrayCurrency.push(element['name'] + ' ' + element['symbol']);
        });
        self.selectedCurrency = (country['currencies'].length > 0) ? arrayCurrency.join(', ') : 'N/A';

        self.selectedLatlng = (country['latlng'].length > 0) ? ('Lat: ' + country['latlng'][0] + ', Lng: ' + country['latlng'][1]) : 'N/A';
        self.selectedLatlngUrl = (country['latlng'].length > 0) ? ('https://www.google.com/maps/?q=' + country['latlng'][0] + ',' + country['latlng'][1]) : '';
        self.selectedPopulation = country['population'] ? formatNumber(country['population']) : 'N/A';
        self.selectedArea = country['area'] ? (formatNumber(country['area']) + ' km²') : 'N/A';
        self.selectedSubregion = (country['subregion'] || 'N/A');
        self.selectedGini = country['gini'] ? (country['gini'] + '%') : 'N/A';
        self.selectedTimezone = (country['timezones'].length > 0) ? country['timezones'].join(', ') : 'N/A';

        $('section').animate({
          opacity: 1
        });
      });
    },
  }
});