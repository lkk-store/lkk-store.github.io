download:
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 store store
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 pages pages
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 upcoming upcoming
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 blog blog
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 wood wood

store: 
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 store store
	
go:
	git add .
	git commit -m "$m"
	git push

run:
	node bin/index.js

showroom:
	node bin/dl-sheet.js 1wav5HPlGXmn3fPv90WF9noG6axFGkeyQFHJ28nvpai0 store store
	node bin/showroom.js

webp:
	mogrify -resize 700x png/*
	for file in png/* ; do \
		cwebp -q 80 $${file} -o "$${file%%.*}.webp" ; \
	done
	mv png/*.webp img
	rm -rf png/*.webp

pngggg:
	for file in img/*.webp ; do \
		/usr/local/bin/dwebp -o "$${file%%.*}.png" $${file} ; \
	done
	

pngs:
	for file in img/store-*.webp ; do \
		ffmpeg -i $${file} $${file%%.*}.png ; \
	done
	mogrify -resize 1000x png/* 


update:
	node bin/dl-sheet.js 1Yi8p5O_CIxtftE8IbLrftsUAV60_pIuXrxNfAgUMb-M Sheet1 orders
	node bin/index.js make
	git add .
	git commit -m "update"
	git push