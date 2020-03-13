let app = new Vue({
    el: '#app',
    data: {
        title: 'Kelikamerat',
        error: '',
        useList: true,
        useMunicipality: false,
        useRoad: false,
        cameraStations: [],
        cameraStationsMeta: [],
        selectedStation: '',
        municipalityToFind: '',
        roadToFind: 0,
        cameras: '',
        camerasPlace: '',
        municipalities: [],
        roadPlaces: [],
        image: '',
        munState: '',
        roadState: ''
    },
    methods: {
        showList: function (){
            this.useList = true;
            this.useMunicipality = false;
            this.useRoad = false;
        },
        showMunicipalities: function (){
            this.useList = false;
            this.useMunicipality = true;
            this.useRoad = false;
        },
        showRoads: function (){
            this.useList = false;
            this.useMunicipality = false;
            this.useRoad = true;
        },
        showCameras: function (){
            if (this.selectedStation != ''){
                let cameraStation = this.cameraStations.filter(function(elem){
                    if (elem.roadStationId == app.selectedStation) return elem;
                });
                this.cameras = cameraStation[0].cameraPresets;
    
                let place = this.cameraStationsMeta.filter(function(elem){
                    if (elem.id == app.selectedStation) return elem;
                });
                this.camerasPlace = place[0];
                this.selectedStation = '';
                this.image = '';
            }
            else alert('Valitse ensin kamera');        
            
        },
        findMunicipality: function (){
            this.municipalities = this.cameraStationsMeta.filter(function(elem){
                if (elem.properties.municipality == app.municipalityToFind) return elem;
            });
            if (this.municipalities.length != 0) this.munState = '';
            else this.munState = 'Ei kameroita valitulle kunnalle';
        },
        findroad: function (){
            this.roadPlaces = this.cameraStationsMeta.filter(function(elem){
                if (elem.properties.roadAddress.roadNumber.toString() == app.roadToFind) return elem;
            });
            if (this.roadPlaces.length != 0) this.roadState = '';
            else this.roadState = 'Ei kameroita valitulle tielle';
        },
        getDatas: function () {
            axios.get('https://tie.digitraffic.fi/api/v1/data/camera-data')
            .then(function (response) {
            app.cameraStations = response.data.cameraStations;
            })
            .catch(function (error) {
            app.error = 'Error! Could not reach the API. ' + error;
            });
            axios.get('https://tie.digitraffic.fi/api/v3/metadata/camera-stations')
            .then(function (response) {
            app.cameraStationsMeta = response.data.features;
            })
            .catch(function (error) {
            app.error = 'Error! Could not reach the API. ' + error;
            });
        },
        cameraName: function (name, index) {
            if (name) return name;
            else return 'Kamera '+index;
        }
    },
    computed: {
        summary: function (){
            if (this.camerasPlace) return 'Paikka: ' + this.camerasPlace.properties.name + ', Kunta: ' + this.camerasPlace.properties.municipality + ', Maakunta: '+ this.camerasPlace.properties.province;
            else return ''; 
        }        
    },
    beforeMount(){
        this.getDatas();
    }
})