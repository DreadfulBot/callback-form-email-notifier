import subprocess
import sys
from base import *


if(len(sys.argv) < 2):
    comment = "fixes"
else:
    comment = sys.argv[1]

subprocess.call("git add .", shell=True, cwd=getParentDir())
subprocess.call(f"git commit -m \"{comment:s}\"")
subprocess.call("git push origin master")
