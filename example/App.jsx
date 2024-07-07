import React from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import ImageGallery from "src/components/ImageGallery";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      mostrarIndice: false,
      mostrarBalas: true,
      infinito: true,
      mostrarMiniaturas: true,
      mostrarBotonPantallaCompleta: true,
      mostrarBotonGaleriaPantallaCompleta: true,
      mostrarBotonReproduccion: false,
      mostrarBotonGaleriaReproduccion: true,
      mostrarNavegacion: true,
      deslizarVerticalmente: false,
      esRTL: false,
      duracionDeslizamiento: 450,
      intervaloDeslizamiento: 2000,
      deslizarSobreMiniatura: false,
      posicionMiniatura: "bottom",
      mostrarVideo: false,
      usarWindowKeyDown: true,
      imagenes: [],
    };
    this._alternarMostrarVideo = this._alternarMostrarVideo.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      const response = await axios.get(
        "https://api.logisticacastrofallas.com/api/Multimedia/Select"
      );
      if (response.data.isSuccess) {
        const mediaData = response.data.data.map((item) => ({
          original: item.description,
          thumbnail: item.description,
          embedUrl: item.description.endsWith(".mp4") ? item.description : null,
          description: item.description.endsWith(".mp4") ? "Video" : "Image",
          renderItem: item.description.endsWith(".mp4")
            ? this._renderizarVideo.bind(this)
            : null,
        }));
        this.setState({ imagenes: mediaData });
      } else {
        console.error("Error fetching media data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching media data:", error);
    }
  }

  _alHacerClickEnImagen(event) {
    console.debug(
      "clic en imagen",
      event.target,
      "en el índice",
      this._imageGallery.getCurrentIndex()
    );
  }

  _alCargarImagen(event) {
    console.debug("imagen cargada", event.target.src);
  }

  _alDeslizar(index) {
    this._reiniciarVideo();
    console.debug("deslizado al índice", index);
  }

  _alPausar(index) {
    console.debug("pausado en el índice", index);
  }

  _alCambiarPantalla(elementoPantallaCompleta) {
    console.debug("¿esPantallaCompleta?", !!elementoPantallaCompleta);
  }

  _alReproducir(index) {
    console.debug("reproduciendo desde el índice", index);
  }

  _manejarCambioInput(estado, evento) {
    if (evento.target.value > 0) {
      this.setState({ [estado]: evento.target.value });
    }
  }

  _manejarCambioCheckbox(estado, evento) {
    this.setState({ [estado]: evento.target.checked });
  }

  _manejarCambioPosicionMiniatura(evento) {
    this.setState({ posicionMiniatura: evento.target.value });
  }

  _reiniciarVideo() {
    this.setState({ mostrarVideo: false });

    if (this.state.mostrarBotonReproduccion) {
      this.setState({ mostrarBotonGaleriaReproduccion: true });
    }

    if (this.state.mostrarBotonPantallaCompleta) {
      this.setState({ mostrarBotonGaleriaPantallaCompleta: true });
    }
  }

  _alternarMostrarVideo() {
    const { mostrarVideo } = this.state;
    this.setState({
      mostrarVideo: !mostrarVideo,
    });

    if (!mostrarVideo) {
      if (this.state.mostrarBotonReproduccion) {
        this.setState({ mostrarBotonGaleriaReproduccion: false });
      }

      if (this.state.mostrarBotonPantallaCompleta) {
        this.setState({ mostrarBotonGaleriaPantallaCompleta: false });
      }
    }
  }

  _renderizarVideo(item) {
    return (
      <div>
        (
        <div className="video-wrapper">
          <button
            className="cerrar-video"
            onClick={this._alternarMostrarVideo}
          />
          <iframe
            title="video de muestra"
            width="560"
            height="315"
            src={item.embedUrl}
            style={{ border: "none" }}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
        )
      </div>
    );
  }

  render() {
    return (
      <section className="app">
        <ImageGallery
          ref={(i) => (this._imageGallery = i)}
          items={this.state.imagenes}
          onClick={this._alHacerClickEnImagen.bind(this)}
          onImageLoad={this._alCargarImagen}
          onSlide={this._alDeslizar.bind(this)}
          onPause={this._alPausar.bind(this)}
          onScreenChange={this._alCambiarPantalla.bind(this)}
          onPlay={this._alReproducir.bind(this)}
          infinite={this.state.infinito}
          showBullets={this.state.mostrarBalas}
          showFullscreenButton={
            this.state.mostrarBotonPantallaCompleta &&
            this.state.mostrarBotonGaleriaPantallaCompleta
          }
          showPlayButton={
            this.state.mostrarBotonReproduccion &&
            this.state.mostrarBotonGaleriaReproduccion
          }
          showThumbnails={this.state.mostrarMiniaturas}
          showIndex={this.state.mostrarIndice}
          showNav={this.state.mostrarNavegacion}
          isRTL={this.state.esRTL}
          thumbnailPosition={this.state.posicionMiniatura}
          slideDuration={parseInt(this.state.duracionDeslizamiento)}
          slideInterval={parseInt(this.state.intervaloDeslizamiento)}
          slideOnThumbnailOver={this.state.deslizarSobreMiniatura}
          additionalClass="app-image-gallery"
          useWindowKeyDown={this.state.usarWindowKeyDown}
          slideVertically={this.state.deslizarVerticalmente}
        />

        <div className="app-sandbox">
          <div className="app-sandbox-content">
            <h2 className="app-header">Configuraciones</h2>

            <ul className="app-buttons">
              <li>
                <div className="app-interval-input-group">
                  <span className="app-interval-label">
                    Intervalo de Reproducción
                  </span>
                  <input
                    className="app-interval-input"
                    type="text"
                    onChange={this._manejarCambioInput.bind(
                      this,
                      "intervaloDeslizamiento"
                    )}
                    value={this.state.intervaloDeslizamiento}
                  />
                </div>
              </li>

              <li>
                <div className="app-interval-input-group">
                  <span className="app-interval-label">
                    Duración del Deslizamiento
                  </span>
                  <input
                    className="app-interval-input"
                    type="text"
                    onChange={this._manejarCambioInput.bind(
                      this,
                      "duracionDeslizamiento"
                    )}
                    value={this.state.duracionDeslizamiento}
                  />
                </div>
              </li>

              <li>
                <div className="app-interval-input-group">
                  <span className="app-interval-label">
                    Posición de la Barra de Miniaturas
                  </span>
                  <select
                    className="app-interval-input"
                    value={this.state.posicionMiniatura}
                    onChange={this._manejarCambioPosicionMiniatura.bind(this)}
                  >
                    <option value="bottom">Abajo</option>
                    <option value="top">Arriba</option>
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>
              </li>
            </ul>

            <ul className="app-checkboxes">
              <li>
                <input
                  id="infinito"
                  type="checkbox"
                  onChange={this._manejarCambioCheckbox.bind(this, "infinito")}
                  checked={this.state.infinito}
                />
                <label htmlFor="infinito">
                  permitir deslizamiento infinito
                </label>
              </li>
              <li>
                <input
                  id="mostrar_pantalla_completa"
                  type="checkbox"
                  onChange={this._manejarCambioCheckbox.bind(
                    this,
                    "mostrarBotonPantallaCompleta"
                  )}
                  checked={this.state.mostrarBotonPantallaCompleta}
                />
                <label htmlFor="mostrar_pantalla_completa">
                  mostrar botón de pantalla completa
                </label>
              </li>
              <li>
                <input
                  id="mostrar_boton_reproduccion"
                  type="checkbox"
                  onChange={this._manejarCambioCheckbox.bind(
                    this,
                    "mostrarBotonReproduccion"
                  )}
                  checked={this.state.mostrarBotonReproduccion}
                />
                <label htmlFor="mostrar_boton_reproduccion">
                  mostrar botón de reproducción
                </label>
              </li>
              <li>
                <input
                  id="mostrar_balas"
                  type="checkbox"
                  onChange={this._manejarCambioCheckbox.bind(
                    this,
                    "mostrarBalas"
                  )}
                  checked={this.state.mostrarBalas}
                />
                <label htmlFor="mostrar_balas">mostrar balas</label>
              </li>
              <li>
                <input
                  id="mostrar_miniaturas"
                  type="checkbox"
                  onChange={this._manejarCambioCheckbox.bind(
                    this,
                    "mostrarMiniaturas"
                  )}
                  checked={this.state.mostrarMiniaturas}
                />
                <label htmlFor="mostrar_miniaturas">mostrar miniaturas</label>
              </li>
              <li>
                <input
                  id="mostrar_navegacion"
                  type="checkbox"
                  onChange={this._manejarCambioCheckbox.bind(
                    this,
                    "mostrarNavegacion"
                  )}
                  checked={this.state.mostrarNavegacion}
                />
                <label htmlFor="mostrar_navegacion">mostrar navegación</label>
              </li>
              <li>
                <input
                  id="mostrar_indice"
                  type="checkbox"
                  onChange={this._manejarCambioCheckbox.bind(
                    this,
                    "mostrarIndice"
                  )}
                  checked={this.state.mostrarIndice}
                />
                <label htmlFor="mostrar_indice">mostrar índice</label>
              </li>
              <li>
                <input
                  id="deslizar_verticalmente"
                  type="checkbox"
                  onChange={this._manejarCambioCheckbox.bind(
                    this,
                    "deslizarVerticalmente"
                  )}
                  checked={this.state.deslizarVerticalmente}
                />
                <label htmlFor="deslizar_verticalmente">
                  deslizar verticalmente
                </label>
              </li>
              <li>
                <input
                  id="es_rtl"
                  type="checkbox"
                  onChange={this._manejarCambioCheckbox.bind(this, "esRTL")}
                  checked={this.state.esRTL}
                />
                <label htmlFor="es_rtl">es de derecha a izquierda</label>
              </li>
              <li>
                <input
                  id="deslizar_sobre_miniatura"
                  type="checkbox"
                  onChange={this._manejarCambioCheckbox.bind(
                    this,
                    "deslizarSobreMiniatura"
                  )}
                  checked={this.state.deslizarSobreMiniatura}
                />
                <label htmlFor="deslizar_sobre_miniatura">
                  deslizar al pasar el ratón sobre miniaturas
                </label>
              </li>
              <li>
                <input
                  id="usar_window_keydown"
                  type="checkbox"
                  onChange={this._manejarCambioCheckbox.bind(
                    this,
                    "usarWindowKeyDown"
                  )}
                  checked={this.state.usarWindowKeyDown}
                />
                <label htmlFor="usar_window_keydown">
                  usar keydown de ventana
                </label>
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

const contenedor = document.getElementById("root");
const root = createRoot(contenedor);
root.render(<App />);
