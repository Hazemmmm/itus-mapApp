import { statesService } from './../services/states.service';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Feature, MapBrowserEvent, Overlay, View } from 'ol';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { OSM, TileImage, TileWMS } from 'ol/source';
import { defaults, FullScreen } from 'ol/control';
import { Extent, getCenter } from 'ol/extent';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { PoiService } from '../services/poi.service';
import Layer from 'ol/layer/Layer';
import Point from 'ol/geom/Point';
import { Coordinate, toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import { InteractionDataService } from '../services/interaction-data.service';
import GeoJSON from 'ol/format/GeoJSON';

@Component({
  selector: 'app-Map',
  templateUrl: './Map.component.html',
  styleUrls: ['./Map.component.css'],
})
export class MapComponent implements OnInit {
  @Input() district: any;
  url: string = 'assets/data/poi.geojson';

  map: any;
  overlay: Overlay;
  content: HTMLElement;
  featureTitle: string;
  featureID: number;
  featureDesc: string;
  featureObjectID: number;
  featureType: string;
  featureList: any;
  poi_source: VectorSource;
  hiddenSource: VectorSource;
  poi_layer: VectorLayer;
  hiddenLayer: VectorLayer;

  australiaExtent: Extent = [
    -262.2318712410088, -42.414667622100076, -188.84319936600878,
    -9.060175434600076,
  ];
  test_soruce: VectorSource;
  test_layer: VectorLayer;
  osm: TileLayer = new TileLayer({
    source: new OSM(),
    zIndex: 0,
  });

  private initMap(): void {
    this.overlay = new Overlay({
      element: <HTMLDivElement>document.getElementById('popup'),
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });
    this.hiddenSource = new VectorSource();
    this.hiddenLayer = new VectorLayer({
      source: this.hiddenSource,
      visible: true,
      zIndex: 6,
    });

    this.poi_source = new VectorSource({
      format: new GeoJSON({
        geometryName: 'Point',
        extractGeometryName: true,
      }),
      url: this.url,
    });
    this.poi_layer = new VectorLayer({
      source: this.poi_source,
      zIndex: 5,
    });

    this.map = new Map({
      overlays: [this.overlay],
      controls: defaults({ attribution: false }).extend([new FullScreen()]),
      target: 'map',
      layers: [this.osm, this.poi_layer, this.hiddenLayer],
      view: new View({
        extent: this.australiaExtent,
        center: getCenter(this.australiaExtent),
        projection: 'EPSG:4326',
        zoom: 5,
        maxZoom: 15,
        minZoom: 5,
      }),
    });
  }
  constructor(
    private states: statesService,
    private poi: PoiService,
    private interactionDataService: InteractionDataService
  ) {}

  ngOnInit(): void {
    console.log(this.district);
    this.interactionDataService.districtValue$.subscribe((value) => {
      // let x = value.toString();
      for (let i = 0; i < value.length; i++) {
        const element = value[i];
        let state_id = parseInt(element['STATE_CODE']);
        console.log(typeof state_id);
        this.interactionDataService.featureIdSource$.subscribe((featureId) => {
          let features = this.poi_layer
            .getSource()
            .getFeatures()
            .filter((feat) => {
              console.log(feat.get('stateID') == featureId);
            });
          if (features) {
            this.map.getView().getZoom() + 1;
          }
        });
      }
    });

    this.initMap();
    this.states.getStatesData(this.map);
    this.poi.getPOIData(this.map);
    this.poi.handleFilterPoiLayer();
    this.map.on('click', this.getFeaturePopUp);

    this.onChangeFilterList();
  }

  onChangeDistrictList(): void {}
  onChangeFilterList(featureId?: any): void {
    this.interactionDataService.featureIdSource$.subscribe((featureId) => {
      this.hiddenSource.clear();
      let features = this.poi_layer
        .getSource()
        .getFeatures()
        .filter((feat) => feat.get('typesID') == featureId);
      if (features) {
        this.poi_layer.setVisible(false);
        this.hiddenSource.addFeatures(features);
      }
    });
  }
  onZoomGetExtent(): void {
    this.map.on('click', () => {
      console.log(this.map.getView().calculateExtent(this.map.getSize()));
    });
  }
  closePopUp(): boolean {
    var closer = <HTMLDivElement>document.getElementById('popup-closer');
    this.overlay.setPosition(undefined);
    closer.blur();
    return false;
  }

  getFeaturePopUp = (e: any) => {
    var container = <HTMLDivElement>document.getElementById('popup');
    var content = <HTMLDivElement>document.getElementById('popup-content');

    let feature = this.map.forEachFeatureAtPixel(
      e.pixel,
      (feature: Feature) => {
        return feature;
      }
    );
    if (feature && feature.getGeometry().getType() === 'Point') {
      console.log(feature);
      let point: Point = <Point>feature.getGeometry();
      let coords: Coordinate = point.getCoordinates();
      const coordinate = e.coordinate;
      this.featureTitle = feature.get('title');
      this.featureID = feature.get('FID');
      this.featureDesc = feature.get('desc');
      this.featureObjectID = feature.get('ObjectID');
      this.featureType = feature.get('types');

      this.overlay.setPosition(coordinate);
    } else {
      this.overlay.setPosition(undefined);
    }
  };
}
