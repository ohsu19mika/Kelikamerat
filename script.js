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
        imageTime: '',
        munState: '',
        roadState: ''
    },
    methods: {
        //Camera place selection by list
        showList: function (){
            this.useList = true;
            this.useMunicipality = false;
            this.useRoad = false;
        },
        //Camera place selection by municipality
        showMunicipalities: function (){
            this.useList = false;
            this.useMunicipality = true;
            this.useRoad = false;
            this.$nextTick(()=>{
                this.$refs["municipalityInput"].focus();
        })},
        //Camera place selection by road number
        showRoads: function (){
            this.useList = false;
            this.useMunicipality = false;
            this.useRoad = true;
        },
        //Finds camera places by municipality
        findMunicipality: function (){
            this.municipalities = this.cameraStationsMeta.filter(function(elem){
                if (elem.properties.municipality.toLowerCase() == app.municipalityToFind.toLowerCase()) return elem;
            });
            if (this.municipalities.length != 0) this.munState = '';
            else this.munState = 'Ei kameroita valitulle kunnalle';
        },
        //Finds camera places by road number
        findroad: function (){
            this.roadPlaces = this.cameraStationsMeta.filter(function(elem){
                if (elem.properties.roadAddress.roadNumber.toString() == app.roadToFind) return elem;
            });
            if (this.roadPlaces.length != 0) this.roadState = '';
            else this.roadState = 'Ei kameroita valitulle tielle';
        },
        //Camera place selection
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
                //First camera is shown as default
                this.image = this.cameras[0].imageUrl;
            }
            else alert('Valitse ensin kamera');        
            
        },
        //Function to get data from APIs
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
        //Returns text for camera selection "button", if camera data has no name for camera then cameras id is returned
        cameraName: function (name, index) {
            if (name) return name;
            else return 'Kamera '+index;
        }
    },
    computed: {
        //Summarizes camera place information
        summary: function (){
            if (this.camerasPlace) return 'Paikka: ' + this.camerasPlace.properties.name + ', Kunta: ' + this.camerasPlace.properties.municipality + ', Maakunta: '+ this.camerasPlace.properties.province;
            else return ''; 
        }        
    },
    beforeMount(){
        this.getDatas();
    }
})