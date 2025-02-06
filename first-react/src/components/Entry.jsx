import PropTypes from "prop-types";


export default function Entry(props) {
    Entry.propTypes = {
        entry: PropTypes.object,
        id: PropTypes.string,
        img: PropTypes.object,
        country: PropTypes.object,
        googleMapsLink: PropTypes.object,
        title: PropTypes.object,
        dates: PropTypes.object,
        text: PropTypes.object,
    };

    return (
        <article className="journal-entry">
                <div className="main-image-container">
                    <img className="main-image" id={props.id} src={props.img.src} alt={props.img.alt}></img>
                </div>
                    <div>   
                        <div className="googleMapsContainer">
                            <img className="marker" src="./src/assets/marker.png" alt="marker"></img>
                            <span className="country-name">{props.country}</span>
                            <a href={props.googleMapsLink}>View on Google Maps</a>
                        </div>
                        <h2 className="location">{props.title}</h2>
                        <p className="dates">{props.dates}</p>
                        <p>{props.text}</p>
                    </div>    
        </article>
    )
}
  