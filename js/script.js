document.addEventListener("DOMContentLoaded", () => {
    let movies = [];
  
    // Cargar datos de la API
    fetch("https://japceibal.github.io/japflix_api/movies-data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar los datos de la API");
        }
        return response.json();
      })
      .then((data) => {
        movies = data;
        console.log("Películas cargadas:", movies);
      })
      .catch((error) => console.error("Error:", error));
  
    const inputBuscar = document.getElementById("inputBuscar");
    const btnBuscar = document.getElementById("btnBuscar");
    const lista = document.getElementById("lista");
    const detalle = document.getElementById("detalle");
  
    // Buscar películas
    btnBuscar.addEventListener("click", () => {
      const searchTerm = inputBuscar.value.trim().toLowerCase();
  
      if (!searchTerm) {
        alert("Por favor, ingresa un término de búsqueda.");
        return;
      }
  
      const resultados = movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.genres.some((genre) => genre.name.toLowerCase().includes(searchTerm)) ||
          (movie.tagline && movie.tagline.toLowerCase().includes(searchTerm)) ||
          (movie.overview && movie.overview.toLowerCase().includes(searchTerm))
      );
  
      mostrarResultados(resultados);
    });
  
    // Mostrar resultados
    const mostrarResultados = (resultados) => {
      lista.innerHTML = "";
  
      if (resultados.length === 0) {
        lista.innerHTML = "<li class='list-group-item bg-danger text-white'>No se encontraron resultados.</li>";
        return;
      }
  
      resultados.forEach((movie) => {
        const item = document.createElement("li");
        item.className = "list-group-item bg-dark text-white";
        item.innerHTML = `
          <h5>${movie.title}</h5>
          <p>${movie.tagline || "Sin tagline disponible"}</p>
          <div>${renderStars(movie.vote_average)}</div>
        `;
        item.addEventListener("click", () => mostrarDetalle(movie));
        lista.appendChild(item);
      });
    };
  
    const mostrarDetalle = (movie) => {
        // Obtener referencias al Offcanvas
        const detalleTitulo = document.getElementById("detalleLabel");
        const detalleCuerpo = document.querySelector("#detalle .offcanvas-body");
      
        // Configurar el contenido del Offcanvas
        detalleTitulo.textContent = movie.title;
        detalleCuerpo.innerHTML = `
          <p>${movie.overview || "Sin descripción disponible."}</p>
          <p><strong>Géneros:</strong> ${movie.genres.map((genre) => genre.name).join(", ")}</p>
          <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
            Más información
          </button>
          <ul class="dropdown-menu">
            <li class="dropdown-item">Año: ${movie.release_date.split("-")[0]}</li>
            <li class="dropdown-item">Duración: ${movie.runtime || "N/A"} min</li>
            <li class="dropdown-item">Presupuesto: $${movie.budget.toLocaleString()}</li>
            <li class="dropdown-item">Ganancias: $${movie.revenue.toLocaleString()}</li>
          </ul>
        `;
      
        // Mostrar el Offcanvas
        const offcanvas = new bootstrap.Offcanvas(document.getElementById("detalle"));
        offcanvas.show();
    };
      

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating / 2); // Número de estrellas llenas
        const halfStar = rating % 2 >= 0.5; // Media estrella si el residuo es mayor o igual a 0.5
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Resto de estrellas vacías
      
        // Generamos las estrellas como elementos HTML
        return (
          '<i class="fa fa-star text-warning"></i>'.repeat(fullStars) + // Estrellas llenas
          (halfStar ? '<i class="fa fa-star-half-o text-warning"></i>' : '') + // Media estrella
          '<i class="fa fa-star-o text-warning"></i>'.repeat(emptyStars) // Estrellas vacías
        );
      };      
  });
  