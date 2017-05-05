all:
	./get_top_scoring_region_tables_from_broadinstitute.sh
	./get_json_assets_from_broadinstitute.sh
	./get_gz_archives_from_broadinstitute.sh
	./update_json_assets.sh
	./fix_json_assets_from_altiusinstitute_to_make_correct_json.sh
	./split_correct_json_assets_from_altiusinstitute.sh
	./cleanup.sh
