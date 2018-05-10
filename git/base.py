import os

source = os.path.dirname(__file__)
parent = os.path.join(source, '../')

def getSourceDir():
    return source

def getParentDir():
    return parent