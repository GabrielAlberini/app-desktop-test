import { useState } from "react";
import axios from "axios";
import "bulma/css/bulma.min.css";
import "./App.css"; // Asegúrate de tener un archivo CSS para tus estilos personalizados

const App = () => {
  const [phrase, setPhrase] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleInputChange = (e) => {
    setPhrase(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/generate", {
        phrase: phrase,
      });

      // La respuesta espera un objeto con la propiedad "url"
      const { url } = response.data;

      setAudioUrl(url);
    } catch (error) {
      console.error("Error realizando la solicitud POST:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero is-fullheight has-background-dark">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="columns is-centered">
            <div className="column is-half">
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label has-text-white">Frase:</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={phrase}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <button
                      className="button is-primary"
                      type="submit"
                      disabled={loading}
                    >
                      Generar
                    </button>
                  </div>
                </div>
              </form>

              {loading && <p>Cargando...</p>}

              {audioUrl && (
                <div>
                  <h2 className="title is-4 has-text-white">Audio:</h2>
                  <audio controls>
                    <source src={audioUrl} type="audio/mpeg" />
                    Tu navegador no admite el elemento de audio.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
