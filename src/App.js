import React, { useState } from "react";
import Slider from "./components/Slider";
import "./styles.scss";

const App = () => {
  const [list, setList] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      img: require(`./assets/img${i + 1}.jpg`),
      info: `information ${i + 1}`,
    }))
  );
  
  return (
    <div className="app">
      <Slider>
        {list.map((item) => (
          <div className="slide" key={item.id}>
            <img className="slide-img" src={item.img} />
            <div className="slide-info">{item.info}</div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default App;
