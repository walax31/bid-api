let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Documents/appman-workspace/bid-api
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +55 start/routes.js
badd +32 app/Controllers/Http/AddressController.js
badd +23 app/Controllers/Http/CredentialController.js
badd +82 test/functional/credential-controller.spec.js
badd +31 util/authenticate.func.js
badd +37 util/cronjobs/revoke-token-util.func.js
badd +74 app/Middleware/CronInitiate.js
badd +16 app/Models/CronJob.js
badd +59 util/cronjobs/cronjob-util.func.js
badd +23 util/UserUtil.func.js
badd +155 app/Controllers/Http/UserController.js
badd +8 database/migrations/1502080967889_cronjob_schema.js
badd +26 package.json
badd +4 app/Validators/StoreUser.js
badd +1 service/bidValidator.js
badd +6 .prettierrc
badd +1 app/Controllers/Http/CustomerController.js
badd +3 app/Controllers/Http/ProductController.js
badd +1 app/Controllers/Http/ProductDetailController.js
badd +1 app/Controllers/Http/BidController.js
badd +1 app/Controllers/Http/OrderController.js
badd +1 app/Controllers/Http/PaymentController.js
badd +24 app/Controllers/Http/AlertController.js
badd +10 app/Middleware/Auth.js
argglobal
%argdel
edit app/Controllers/Http/CredentialController.js
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 102 + 106) / 213)
exe 'vert 2resize ' . ((&columns * 110 + 106) / 213)
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 32 - ((31 * winheight(0) + 25) / 50)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
32
normal! 024|
wincmd w
argglobal
if bufexists("start/routes.js") | buffer start/routes.js | else | edit start/routes.js | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 1 - ((0 * winheight(0) + 25) / 50)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
lcd ~/Documents/appman-workspace/bid-api
wincmd w
2wincmd w
exe 'vert 1resize ' . ((&columns * 102 + 106) / 213)
exe 'vert 2resize ' . ((&columns * 110 + 106) / 213)
tabnext 1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 winminheight=1 winminwidth=1 shortmess=filnxtToOFcI
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
let g:this_session = v:this_session
let g:this_obsession = v:this_session
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
