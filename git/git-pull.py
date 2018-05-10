import subprocess
from base import *

subprocess.call("git pull origin master", shell=True, cwd=getParentDir())
