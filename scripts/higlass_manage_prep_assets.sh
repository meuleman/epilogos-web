#!/bin/bash

set -e

source ${PWD}/.env

if [ -z "${REACT_APP_HIGLASS_SERVICE_PROTOCOL}" ]; then
    echo "Error: REACT_APP_HIGLASS_SERVICE_PROTOCOL not set"
    exit -1
fi

if [ -z "${REACT_APP_HIGLASS_SERVICE_HOSTNAME}" ]; then
    echo "Error: REACT_APP_HIGLASS_SERVICE_HOSTNAME not set"
    exit -1
fi

hgServer="${REACT_APP_HIGLASS_SERVICE_PROTOCOL}://${REACT_APP_HIGLASS_SERVICE_HOSTNAME}"

mkdir -p ${PWD}/scripts/hgManage-assets

#
# hg19
#
# chromsizes
if [ ! -f ${PWD}/scripts/hgManage-assets/hg19.chrom.sizes.fixedBin.txt ]; then
    wget -O ${PWD}/scripts/hgManage-assets/hg19.chrom.sizes.fixedBin.txt ${hgServer}/media/hg19.chromsizes.fixedBin.txt
fi
# genes
if [ ! -f ${PWD}/scripts/hgManage-assets/hg19.genes.fixedBin.db ]; then
    wget -O ${PWD}/scripts/hgManage-assets/hg19.genes.fixedBin.db ${hgServer}/media/gencode.v19.annotation.gtf.v2.hgnc.longest.noChrM.bed14.fixedBin.db
fi
# transcripts
if [ ! -f ${PWD}/scripts/hgManage-assets/hg19.transcripts.fixedBin.db ]; then
    wget -O ${PWD}/scripts/hgManage-assets/hg19.transcripts.fixedBin.db ${hgServer}/media/gencode.v19.annotation.gtf.higlass-transcripts.hgnc.101621.forceHGNC.beddb
fi

#
# hg38
#
# chromsizes
if [ ! -f ${PWD}/scripts/hgManage-assets/hg38.chrom.sizes.fixedBin.txt ]; then
    wget -O ${PWD}/scripts/hgManage-assets/hg38.chrom.sizes.fixedBin.txt ${hgServer}/media/hg38.chromsizes.fixedBin.txt
fi
# genes
if [ ! -f ${PWD}/scripts/hgManage-assets/hg38.genes.fixedBin.db ]; then
    wget -O ${PWD}/scripts/hgManage-assets/hg38.genes.fixedBin.db ${hgServer}/media/gencode.v28.basic.annotation.gtf.genePred.hgnc.longest.noChrM.bed14.fixedBin.db
fi
# transcripts
if [ ! -f ${PWD}/scripts/hgManage-assets/hg38.transcripts.fixedBin.db ]; then
    wget -O ${PWD}/scripts/hgManage-assets/hg38.transcripts.fixedBin.db ${hgServer}/media/gencode.v38.annotation.gtf.higlass-transcripts.hgnc.090721.forceHGNC.beddb
fi

#
# mm10
#
# chromsizes
if [ ! -f ${PWD}/scripts/hgManage-assets/mm10.chrom.sizes.fixedBin.txt ]; then
    wget -O ${PWD}/scripts/hgManage-assets/mm10.chrom.sizes.fixedBin.txt ${hgServer}/media/mm10.chromsizes.fixedBin.txt
fi
# genes
if [ ! -f ${PWD}/scripts/hgManage-assets/mm10.genes.fixedBin.db ]; then
    wget -O ${PWD}/scripts/hgManage-assets/mm10.genes.fixedBin.db ${hgServer}/media/mm10.gencode.vM21.annotation.gtf.genePred.hgnc.longest.noChrM.bed14.fixedBin.db
fi
# transcripts
if [ ! -f ${PWD}/scripts/hgManage-assets/mm10.transcripts.fixedBin.db ]; then
    wget -O ${PWD}/scripts/hgManage-assets/mm10.transcripts.fixedBin.db ${hgServer}/media/gencode.vM21.annotation.gtf.higlass-transcripts.longest-isoform.072921.beddb
fi