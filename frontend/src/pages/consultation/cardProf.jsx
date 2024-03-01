import "./cardProf.css"

const CardProf = ({imgName}) => {
    return ( 
        <>
        <div className="whole-card-cons">
            <img src={imgName}/>
            <div className="texts-card">
                <div className="text-inside">
                <h4>Luke Belmar</h4>
                <p>i provide a safe and confidential space to discuss your thoughts,emotions, and challenges.together, we’ll work on developing coping strategies,managing stress.</p>
                <h5>trungkienspktnd@gamail.com</h5>
                </div>
               
            </div>
        </div>
        </>
     );
}
 
export default CardProf;