'use strict';

const starWars = [];

window.onload = () => {

    let cards = document.getElementsByClassName('card');
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const personNames = card.children[0].innerText;
        card.addEventListener('click', async () => {
            const { results } = await getPerson(personNames)
            infoPerson(results[0]);
        })

    }
 
}

const getPerson = async (nombre) => {
    const URL =`https://swapi.dev/api/people/?search=${nombre}&format=json`;
    let response = await fetch(URL)
    if(response.ok){
        try{
            const data = await response.json();
            return { results: data.results };
        } catch(error) {
            throw new Error('Error: Fallo al parsear la respuesta del JSON');
        }
    } else{
        throw new Error('Fallo en la consulta de la api ' + response.statusText);
    }
}

const infoPerson = async (character) => {
    
    const sectionPerson = document.getElementsByClassName('character')[0];
    contentPersonDel();
    
    let h2character = document.createElement('h2');
    h2character.textContent= character.name;
    sectionPerson.appendChild(h2character);
    
    let h3Fisic= document.createElement('h3');
    h3Fisic.textContent = 'Caracteristicas del personaje';
    sectionPerson.appendChild(h3Fisic)

    let articleInfo = await caracteristicasPersonaje(character);
    sectionPerson.appendChild(articleInfo);

    let peliculas = await filmsPerson(character);
    sectionPerson.appendChild(peliculas);

    if(character.species.length > 0) {
        let especie = await especiePerson(character);
        sectionPerson.appendChild(especie);
    }

    if(character.vehicles.length > 0) {
        let vehiculos = createVehiculos(character);
        sectionPerson.appendChild(vehiculos);
    }
        
}

const contentPersonDel = () => {
    const sectionPerson = document.getElementsByClassName('character')[0];
    while(sectionPerson.hasChildNodes()){
        sectionPerson.childNodes[0].remove();
    }
}

    const feAPI = async (url) => {
        let response = await fetch(url)
        if(response.ok) {
            try {
                return await response.json();
            } catch (error) {
                throw new Error('Error: Fallo al parsear la respuesta del JSON')
            }
        } else {
            throw new Error('Fallo en la consulta de la api ' + response.statusText);
        }
    }

    const caracteristicasPersonaje = async (character) => {
        let articleInfo = document.createElement('article');

        let cNacimiento = document.createElement('p');
        cNacimiento.textContent = `Año de nacimiento: ${character.birth_year}`;
        articleInfo.appendChild(cNacimiento);

        let chNacimiento = document.createElement('p');
        let homeworldNac = await feAPI(character.homeworld);
        chNacimiento.textContent = `Lugar de Nacimiento: ${homeworldNac.name}`;
        articleInfo.appendChild(chNacimiento);

        let cAltura = document.createElement('p');
        cAltura.textContent = `Altura: ${character.height} cm`;
        articleInfo.appendChild(cAltura);

        let cOjos = document.createElement('p');
        cOjos.textContent = `Color de los ojos: ${character.eye_color}`;
        articleInfo.appendChild(cOjos);

        let cPiel = document.createElement('p');
        cPiel.textContent = `Color de la piel: ${character.skin_color}`;
        articleInfo.appendChild(cPiel);

        let cMass = document.createElement('p');
        cMass.textContent= `Peso: ${character.mass} kgs`;
        articleInfo.appendChild(cMass);

        return articleInfo;
    }

    const filmsPerson = async ({films}) => {
        let sectionPerson = document.createElement('section');
        console.log(sectionPerson);
        let h3Film = document.createElement('h3');
        h3Film.textContent = 'Películas';
        sectionPerson.appendChild(h3Film);
        films.forEach( async (film) => {
            const articleFilm = document.createElement('article');
            const {director, title, release_date} = await feAPI(film);
            articleFilm.textContent= title;
            articleFilm.className= 'pelicula';

            const fDirector = document.createElement('p');
            fDirector.textContent=`Director de la película: ${director}`;
            articleFilm.appendChild(fDirector);

            const fLanzamiento = document.createElement('p');
            fLanzamiento.textContent = `Lanzamiento de la pelicula ${release_date}`;
            articleFilm.appendChild(fLanzamiento);
            sectionPerson.appendChild(articleFilm)
        });
        return sectionPerson;
    }

    const createVehiculos = ({vehicles}) => {
        let sectionVehic = document.createElement('section');
        let h3vehic = document.createElement('h3');
        h3vehic.textContent= 'Vehiculos';
        sectionVehic.appendChild(h3vehic);
        vehicles.forEach(async (vehiculos_url) => {
            const articleVehic = document.createElement('article');
            const { name } = await feAPI(vehiculos_url);
            articleVehic.append(name);
            sectionVehic.appendChild(articleVehic)
        })
        return sectionVehic;
    }



    const especiePerson = async ({species}) => {
        let sectionEspec = document.createElement('section');
        let h3Species = document.createElement('h3');
        h3Species.append('Caracteristicas de la especie');
        sectionEspec.appendChild(h3Species);
        species.forEach(async (specie_url) =>{
            const {name, language, average_lifespan, classification} = await feAPI(specie_url);
            let articleName = document.createElement('article');
            let articleLanguage = document.createElement('article');
            let articleLifespan = document.createElement('article');
            let articleCladdification = document.createElement('article');

            articleName.append(`Nombre especie: ${name}`);
            articleLanguage.append(`Idioma: ${language}`);
            articleLifespan.append(`Vida media: ${average_lifespan}`);
            articleCladdification.append(`Classification: ${classification}`);
            sectionEspec.appendChild(articleName);
            sectionEspec.appendChild(articleLanguage);
            sectionEspec.appendChild(articleLifespan);
            sectionEspec.appendChild(articleCladdification);
        })
        return sectionEspec;
    }

