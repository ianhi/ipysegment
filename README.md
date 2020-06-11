![demo](zoop.gif)

## Controls
 - left click to lasso
 - right/middle click to pan
 - scroll to zoom


 
# ipysegment

[![Build Status](https://travis-ci.org//ipysegment.svg?branch=master)](https://travis-ci.org//ipysegment)
[![codecov](https://codecov.io/gh//ipysegment/branch/master/graph/badge.svg)](https://codecov.io/gh//ipysegment)


manual image segmentation in jupyter

## Installation

You can install using `pip`:

```bash
pip install ipysegment
```

Or if you use jupyterlab:

```bash
pip install ipysegment
jupyter labextension install @jupyter-widgets/jupyterlab-manager
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:
```bash
jupyter nbextension enable --py [--sys-prefix|--user|--system] ipysegment
```