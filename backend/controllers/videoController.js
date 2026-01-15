const { exec } = require("child_process");
const path = require("path");

exports.generateVideo = (req, res) => {
  // Path to venv python.exe
  const pythonExe = path.join(
    __dirname,
    "../../python/venv/Scripts/python.exe"
  );

  // Path to Python script
  const scriptPath = path.join(
    __dirname,
    "../../python/video_generator.py"
  );

  const command = `"${pythonExe}" "${scriptPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Python execution error:", stderr || error.message);
      return res.status(500).json({
        error: "Video generation failed"
      });
    }

    console.log(stdout);

    res.json({
      videoUrl: "/uploads/video/incident.mp4"
    });
  });
};
