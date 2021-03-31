import React from "react";
import { Slider, Radiom, Select } from "antd";
const { Option } = Select;

const allTitle = 
["American Beauty (1999)",
"Star Wars: Episode IV - A New Hope (1977)",
"Star Wars: Episode V - The Empire Strikes Back (1980)",
"Star Wars: Episode VI - Return of the Jedi (1983) ",
"Jurassic Park (1993)",
"Saving Private Ryan (1998)",
"Terminator 2: Judgment Day (1991)",
"Matrix, The (1999)",
"Back to the Future (1985)",
"Silence of the Lambs, The (1991)",
"Men in Black (1997)",
"Raiders of the Lost Ark (1981)",
"Fargo (1996)",
"Sixth Sense, The (1999)",
"Braveheart (1995)",
"Shakespeare in Love (1998)",
"Princess Bride, The (1987)",
"Schindler's List (1993)",
"L.A. Confidential (1997)",
"Groundhog Day (1993)",
"E.T. the Extra-Terrestrial (1982)",
"Star Wars: Episode I - The Phantom Menace (1999)",
"Being John Malkovich (1999)",
"Shawshank Redemption, The (1994)",
"Godfather, The (1972)"];                                   

export default function Filters({ dimensions, value, onChange }) {
  const { title, rating } = value;

  return (
    <div className="control-panel__data__item_twoline">
      <div>Filters:</div>
      {dimensions["Title"] ? (
        <div className="control-panel__data__item">
          <div>Title:</div>
          <Select
            defaultValue="Select a movie title"
            style={{
              width: "360px",
              paddingLeft: "10px",
            }}
            onChange={(e) => {
              onChange({
                ...value,
                title: e,
              });
            }}
          >
            {allTitle.map((name) => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </div>
      ) : null}

      {dimensions["Rating"] ? (
        <div className="control-panel__data__item">
          <div>Rating:</div>
          <Slider
            range
            step={1}
            min={1}
            max={5}
            value={[1, 5]}
            // onChange={(range) => {
            //   onChange({ ...value, latFrom: range[0], latTo: range[1] });
            // }}
          />
        </div>
      ) : null}
    </div>
  );
}
