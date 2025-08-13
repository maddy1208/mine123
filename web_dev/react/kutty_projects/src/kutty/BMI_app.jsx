import '../css/bmi.css'
const BMI_app = () => {
  return (
    <>

<div className="container">

    <div className="image">
      
    </div>
    <div className="contents">

        <h2>BMI claculator</h2>
        <label htmlFor="">Height (cm)</label>
        <input type="text" />
        <label htmlFor="">Weight (kgs)</label>
        <input type="text" />
        <button>Calculate BMI</button>
        <div className="result">
            <p>Your BMI is 45</p>
            <p>Status: Over Weight</p>
        </div>
    </div>
</div>

    </>
  );
}

export default BMI_app;
