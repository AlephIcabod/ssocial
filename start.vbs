set objshell = createobject("wscript.shell")
objshell.run "sistema.bat",vbhide
objshell.run "http://localhost:3000"
