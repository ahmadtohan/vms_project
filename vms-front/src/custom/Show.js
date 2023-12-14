import { Tag } from "primereact/tag";


export function Show(props) {
 return (
  <div>
{Object.keys(props.rows).map((row) => (
      <div key={row}  className="flex align-items-center gap-3">
        {Object.keys(props.rows[row]).map((key) => (
          <div key={key} style={{ margin: "20px" }}>
            <span className="flex align-items-center gap-2">
              <i className={props.rows[row][key].icon}></i>

              <span className="font-semibold">
                {props.rows[row][key]["isTag"] === true ? (
                  <Tag
                    severity={props.severityByStatus(
                      props.rows[row][key]["subKey"] !== undefined
                        ? props.object[key][props.rows[row][key]["subKey"]]
                        : props.object[key]
                    )}
                  >
                    {props.rows[row][key]["subKey"] !== undefined
                      ? props.object[key][props.rows[row][key]["subKey"]]
                      : props.object[key]}
                  </Tag>
                ) : props.rows[row][key]["subKey"] !== undefined ? (
                  props.object[key][props.rows[row][key]["subKey"]]
                ) : (
                  props.object[key]
                )}


              </span>
            </span>
            <small>{props.rows[row][key].label}</small>
          </div>
        ))}
        </div>
        ))
}
</div>
);

}