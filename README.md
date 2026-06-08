# Soil C:N mapping across Germany:
# Comparing random forest and cubist machine learning in terms of performance and spatial prediction patterns

This repository contains the code for conducting a comparison between random forest and cubist machine learning for modeling soil C:N ratios across Germany. We used Quarto to integrate code with reporting. Similar to RMarkdown, the main file `report.qmd` can also be accessed via RStudio.

# Contents

`report.qmd` is the Quarto file which contains both our code and the Markdown manuscript. It can be rendered to PDF or HTML (see Instructions).

All data is located in the `data` folder. Covariate layers can be found in the subdirectory `covariates`. Prediction layers from bootstrapping are written to the `bootstrap_prediction_layers` subdirectory. `bootstrap_summaries` contains the mean, uncertainty, and difference layers derived from there predictions.

`GEE-script-NDVI.js` contains the JavaScript code used to retrieve the NDVI layer from Google Earth Engine.

`references.bib` contains the references in BibTeX format.

`renv.lock` contains the list of packages used in the project (see Instructions for how to replicate the environment)

The files `_quarto.yml` and `before-body.tex` are used for Quarto rendering.

# Instructions

## Rendering

The Quarto file can be rendered to two formats. 

If you execute the following command in the terminal: 

```{bash}
quarto render report.qmd --to pdf
```

the file will be rendered to a PDF that contains text and code outputs (figures and tables), but not the code itself. This file represents the final report. Rendering to PDF requires a recent version of a TeX distribution. The recommended TinyTeX can be installed via:

```{bash}
quarto install tinytex
```

The other rendering option is to run

```{bash}
quarto render report.qmd --to html
```

which will render the file to an HTML that also displays the code. 

Please note that rendering can take 10-15 minutes since the code is executed again. Furthermore, you need to be connected to the internet.

## Packages

The R environment is managed via `renv`, which can be used to load all required libraries from the `renv.lock` file.

If you do not have `renv` installed yet, run `install.packages("renv")` in your R terminal.

Open the project (`report.Rproj`) in RStudio, then run `renv::restore()` in the terminal. If prompted, select `Activate the project and use the project library.`. When asked `Do you want to proceed? [Y/n]: `, please enter `Y` and all packages required to conduct the analysis will be loaded.

## Settings

Please adjust the `root.dir` option in the YAML header to your local file path.

Note that there are two coding sections that are by default skipped because computations take a long time

1. calculation of the land cover dissimilarity raster (approx. 10 minutes) - only needs to be run once since it is then saved to disk and can be loaded directly

2. bootstrapping (approx. 4 hours) - if the six summary layers (in `data/bootstrap_summaries`) are available and up to date, script can be run without problem even without repeated bootstrapping.

Enable execution (if something about code affecting predictor layers or prediction changed) by setting `redo_lc_dissim` and `redo_bootstrap` to `TRUE`, respectively.

## Data

You will need to download the following data to run the analysis:

### HFP

from https://figshare.com/articles/figure/An_annual_global_terrestrial_Human_Footprint_dataset_from_2000_to_2018/16571064

download `hfp2015.zip` 

add `hfp2015.tif` to `data/covariates/`

### Elevation

from https://zenodo.org/records/1447210

download `dtm_elevation_merit.dem_m_250m_s0..0cm_2017_v1.0.tif`

and add to `data/covariates/`

### Soil respiration

from https://www.earthdata.nasa.gov/data/catalog/ornl-cloud-soilresp-heterotrophicresp-1928-1

do direct download of folder (requires EarthData login), then extract file `soil_Rs_mean.tif`

add to `data/covariates/`

### Land cover

from https://zenodo.org/records/3939038

download `PROBAV_LC100_global_v3.0.1_2015-base_Discrete-Classification-map_EPSG-4326.tif`

and add to `data/covariates/`

### Natura 2000 shapefile

from https://sdi.eea.europa.eu/data/91357f39-7866-41ce-b447-43905c364ec8

download the `SHP` folder

and add to `data/`
