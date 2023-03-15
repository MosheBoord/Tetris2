import "./SettingsDialog.css";

export default function SettingsDialog({ layout, game, settings }) {
  const { seed, useCustomSeed } = settings;
  return (
    <div className="settings-dialog">
      <div className="settings-dealog-row">
        Use Custom Seed: &nbsp;
        <input
          type="checkbox"
          style={{ width: "3vh" }}
          checked={useCustomSeed}
          onChange={(event) => {
            game.setSetting("useCustomSeed", event.target.checked);
            console.log(event);
          }}
        ></input>
        &nbsp; Seed: &nbsp;
        <input
          type="text"
          value={seed}
          onChange={(event) => {
            game.setSetting("seed", event.target.value);
          }}
        ></input>
      </div>
      <div className="settings-dealog-row">
        <input
          type="button"
          value={"Save Settings"}
          style={{ height: "5vh" }}
          onClick={() => {
            game.saveSettings();
          }}
        ></input>
      </div>
    </div>
  );
}
