// ready function
$(document).ready(function () {
    const url = 'https://api.themoviedb.org/3';
    const apiKey = '211814a8a84d4fa66d71b51e5f475a94';
    const imageBaseUrl = 'https://www.themoviedb.org/t/p/w220_and_h330_face';
    const imageBaseUrlBackdrop = 'https://image.tmdb.org/t/p/w1920_and_h800_multi_faces';
    var path = window.location.href;

    // async function discover movies
    async function discoverMovies() {
        const response = await fetch(`${url}/discover/movie?api_key=${apiKey}`);
        const data = await response.json();
        return data;
    }

    // async function now_playing movies
    async function nowPlayingMovie() {
        const response = await fetch(`${url}/movie/now_playing?api_key=${apiKey}`);
        const data = await response.json();
        return data;
    }

    // async function popular movies
    async function popularMovie() {
        const response = await fetch(`${url}/movie/popular?api_key=${apiKey}&region=ID`);
        const data = await response.json();
        return data;
    }

    // async function getKeyword
    async function getKeyword(id) {
        const response = await fetch(`${url}/movie/${id}/keywords?api_key=${apiKey}`);
        const data = await response.json();
        return data.keywords;
    }

    // async function getMovie
    async function getMovie(id) {
        const response = await fetch(`${url}/movie/${id}?api_key=${apiKey}`);
        const data = await response.json();
        return data;
    }

    // async function getRecommendation
    async function getRecommendation(id) {
        const response = await fetch(`${url}/movie/${id}/recommendations?api_key=${apiKey}`);
        const data = await response.json();
        return data.results;
    }

    // async function getMovieCredits
    async function getMovieCredits(id) {
        const response = await fetch(`${url}/movie/${id}/credits?api_key=${apiKey}`);
        const data = await response.json();
        return data;
    }

    if (path.indexOf('index') == -1 || path.indexOf('index') > -1) {
        let html = '';
        discoverMovies().then(data => {
            data.results.forEach(movie => {
                html += `
                    <article class="movie">
                        <a href="/movie.html?id=${movie.id}">
                            <div class="movie-meta">
                                <div class="movie-image">
                                    <img src="${imageBaseUrl}${movie.poster_path}" alt="${movie.title}">
                                </div>
                                <div class="movie-content">
                                    <div class="movie-title">${movie.title}</div>
                                    <div class="movie-year">${movie.release_date}</div>
                                </div>
                            </div>
                        </a>
                    </article>
                `;
                $('#movlist').html(html);
            });
        });
    }

    if (path.indexOf('now_playing') > -1) {
        let html = '';
        nowPlayingMovie().then(data => {
            data.results.forEach(movie => {
                html += `
                    <article class="movie">
                        <a href="/movie.html?id=${movie.id}">
                            <div class="movie-meta">
                                <div class="movie-image">
                                    <img src="${imageBaseUrl}${movie.poster_path}" alt="${movie.title}">
                                </div>
                                <div class="movie-content">
                                    <div class="movie-title">${movie.title}</div>
                                    <div class="movie-year">${movie.release_date}</div>
                                </div>
                            </div>
                        </a>
                    </article>
                `;

                $('#movlist').html(html);
            });
        })
    }

    if (path.indexOf('popular_id') > -1) {
        let html = '';
        popularMovie().then(data => {
            data.results.forEach(movie => {
                html += `
                    <article class="movie">
                        <a href="/movie.html?id=${movie.id}">
                            <div class="movie-meta">
                                <div class="movie-image">
                                    <img src="${imageBaseUrl}${movie.poster_path}" alt="${movie.title}">
                                </div>
                                <div class="movie-content">
                                    <div class="movie-title">${movie.title}</div>
                                    <div class="movie-year">${movie.release_date}</div>
                                </div>
                            </div>
                        </a>
                    </article>
                `;

                $('#movlist').html(html);
            });
        })
    }

    if (path.indexOf('movie') > -1) {
        let id = path.split('=')[1];

        getMovie(id).then(data => {
            let stt;
            var genres = [];
            let stts = '';
            let keywords;

            // start movie detail
            $.each(data.genres, function (index, value) {
                genres.push(value.name);
            });

            $("#imgcover").css("background-image", `url(${imageBaseUrlBackdrop}/${data.backdrop_path})`);
            $(".movie-meta-wrapper .img-poster").html(
                data.poster_path == null 
                    ? `<img src="https://images.pond5.com/white-movie-clapper-icon-shadow-footage-209120897_iconl.jpeg">` 
                    : `<img src="${imageBaseUrl}${data.poster_path}" alt="${data.title}">`
            );
            $(".movie-meta .movie-title").html(data.title);
            $(".movie-meta .status").html(`
                <ul>
                    <li>${data.status}</li>
                    <li>${data.release_date.replaceAll("-", "/")}</li>
                    <li>${genres.join(', ')}</li>
                    <li>${Math.trunc(data.runtime / 60)}h ${data.runtime % 60}m</li>
                </ul>
            `);

            $(".movie-meta .tagline").html(data.tagline);
            $(".movie-meta .overview").html(data.overview);
            $(".movie-meta .imdb").html(
                `<a href="https://www.imdb.com/title/${data.imdb_id}" class="imdb-button" target="_blank">Show On IMDB</a>`
            );
            // end movie detail

            // start movie other detail
            stts += `
                    <h2 class="mb-1">Detail</h2>

                    <div class="mb-1">
                        <h4 class="mb-5px">Status</h4>
                        <p>${data.status}</p>   
                    </div>

                    <div class="mb-1">
                        <h4 class="mb-5px">Original Language</h4>
                        <p>${data.original_language == 'en' ? 'English' : data.original_language}</p>   
                    </div>

                    <div class="mb-1">
                        <h4 class="mb-5px">Budget</h4>
                        <p>${data.budget == 0 ? 'Unknown' : data.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>   
                    </div>

                    <div class="mb-1">
                        <h4 class="mb-5px">Revenue</h4>
                        <p>${data.revenue == 0 ? 'Unknown' : data.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>   
                    </div>

                    <div class="mb-1">
                        <h4 class="mb-5px">Keywords</h4>
                        <div id="keywords"></div>
                    </div>
                `;
            // end movie other detail

            $(".detailed-movie").html(stts);
        });

        // start movie credits
        getMovieCredits(id).then(data => {
            let html = '';
            $.each(data.cast, function (index, value) {
                html += `
                    <div class="card p-0">
                        <img src="${value.profile_path == null
                        ? 'https://www.its.ac.id/international/wp-content/uploads/sites/66/2020/02/blank-profile-picture-973460_1280.jpg'
                        : `https://www.themoviedb.org/t/p/w138_and_h175_face/${value.profile_path}`}" alt="${value.name}">
                        <div class="card-body">
                            <h3>${value.name}</h3>
                            <p>${value.character}</p>
                        </div>
                    </div>
                `;
            });

            $(".cast-list").html(html);
        });
        // end movie credits

        // start movie recommendations
        getRecommendation(id).then(data => {
            let html = '';
            var i = 1;
            $.each(data, function (index, value) {
                // ${imageBaseUrl}${value.poster_path}" alt="${value.title}
                if (i<=5) {
                    html += `
                        <article class="movie">
                            <a href="/movie.html?id=${value.id}">
                                <div class="movie-meta">
                                    <div class="movie-image">
                                        <img src="${value.poster_path == null 
                                            ? `https://images.pond5.com/white-movie-clapper-icon-shadow-footage-209120897_iconl.jpeg` 
                                            : `${imageBaseUrl}${value.poster_path}" alt="${value.title}`
                                        }">
                                    </div>
                                    <div class="movie-content">
                                        <div class="movie-title">${value.title}</div>
                                        <div class="movie-year">${value.release_date}</div>
                                    </div>
                                </div>
                            </a>
                        </article>
                    `;
                }
                i++;
            });

            $(".related-movie").html(html);
        });
        // end movie recommendations


        // start movie keywords
        getKeyword(id).then(data => {
            let html = '';
            $.each(data, function (index, value) {
                html += `
                    <span class="badge badge-secondary">${value.name}</span>
                `;
            });
            $("#keywords").html(html);
        })
        // end movie keywords
    }

});