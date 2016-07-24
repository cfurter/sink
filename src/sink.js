// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/sink

//
// opcodes
//

function varloc_new(fdiff, index){
	return { fdiff: fdiff, index: index };
}

var OP_NOP         = 0x00; //
var OP_NIL         = 0x01; // [TGT]
var OP_MOVE        = 0x02; // [TGT], [SRC]
var OP_NUM_POS     = 0x03; // [TGT], [VALUE]
var OP_NUM_NEG     = 0x04; // [TGT], [VALUE]
var OP_NUM_TBL     = 0x05; // [TGT], [INDEX]
var OP_STR         = 0x06; // [TGT], [INDEX]
var OP_ADD         = 0x07; // [TGT], [SRC1], [SRC2]
var OP_MOD         = 0x08; // [TGT], [SRC1], [SRC2]
var OP_SUB         = 0x09; // [TGT], [SRC1], [SRC2]
var OP_MUL         = 0x0A; // [TGT], [SRC1], [SRC2]
var OP_DIV         = 0x0B; // [TGT], [SRC1], [SRC2]
var OP_POW         = 0x0C; // [TGT], [SRC1], [SRC2]
var OP_CAT         = 0x0D; // [TGT], [SRC1], [SRC2]
var OP_PUSH        = 0x0E; // [TGT], [SRC1], [SRC2]
var OP_UNSHIFT     = 0x0F; // [TGT], [SRC1], [SRC2]
var OP_APPEND      = 0x10; // [TGT], [SRC1], [SRC2]
var OP_PREPEND     = 0x11; // [TGT], [SRC1], [SRC2]
var OP_LTE         = 0x12; // [TGT], [SRC1], [SRC2]
var OP_LT          = 0x13; // [TGT], [SRC1], [SRC2]
var OP_GTE         = 0x14; // [TGT], [SRC1], [SRC2]
var OP_GT          = 0x15; // [TGT], [SRC1], [SRC2]
var OP_NEQ         = 0x16; // [TGT], [SRC1], [SRC2]
var OP_EQU         = 0x17; // [TGT], [SRC1], [SRC2]
var OP_GETAT       = 0x18; // [TGT], [SRC1], [SRC2]
var OP_SETAT       = 0x19; // [SRC1], [SRC2], [SRC3]
var OP_SLICE       = 0x1A; // [TGT], [SRC1], [SRC2], [SRC3]
var OP_TONUM       = 0x1B; // [TGT], [SRC]
var OP_NEG         = 0x1C; // [TGT], [SRC]
var OP_SIZE        = 0x1D; // [TGT], [SRC]
var OP_NOT         = 0x1E; // [TGT], [SRC]
var OP_SHIFT       = 0x1F; // [TGT], [SRC]
var OP_POP         = 0x20; // [TGT], [SRC]
var OP_ISNUM       = 0x21; // [TGT], [SRC]
var OP_ISSTR       = 0x22; // [TGT], [SRC]
var OP_ISLIST      = 0x23; // [TGT], [SRC]
var OP_LIST        = 0x24; // [TGT]
var OP_SAY         = 0x30; // [TGT], [SRC]
var OP_ASK         = 0x31; // [TGT], [SRC]
var OP_NUM_FLOOR   = 0x32; // [TGT], [SRC]
var OP_NUM_CEIL    = 0x33; // [TGT], [SRC]
var OP_NUM_ROUND   = 0x34; // [TGT], [SRC]
var OP_NUM_SIN     = 0x35; // [TGT], [SRC]
var OP_NUM_COS     = 0x36; // [TGT], [SRC]
var OP_NUM_TAN     = 0x37; // [TGT], [SRC]
var OP_NUM_ASIN    = 0x38; // [TGT], [SRC]
var OP_NUM_ACOS    = 0x39; // [TGT], [SRC]
var OP_NUM_ATAN    = 0x3A; // [TGT], [SRC]
var OP_NUM_ATAN2   = 0x3B; // [TGT], [SRC1], [SRC2]
var OP_NUM_LOG     = 0x3C; // [TGT], [SRC]
var OP_NUM_LOG2    = 0x3D; // [TGT], [SRC]
var OP_NUM_LOG10   = 0x3E; // [TGT], [SRC]
var OP_NUM_ABS     = 0x3F; // [TGT], [SRC]
var OP_NUM_PI      = 0x40; // [TGT]
var OP_NUM_TAU     = 0x41; // [TGT]
var OP_NUM_LERP    = 0x42; // [TGT], [SRC1], [SRC2], [SRC3]
var OP_NUM_MAX     = 0x43; // [TGT], [SRC]
var OP_NUM_MIN     = 0x44; // [TGT], [SRC]
var OP_LIST_NEW    = 0x45; // [TGT], [SRC1], [SRC2]
var OP_LIST_FIND   = 0x46; // [TGT], [SRC1], [SRC2], [SRC3]
var OP_LIST_FINDREV= 0x47; // [TGT], [SRC1], [SRC2], [SRC3]
var OP_LIST_REV    = 0x48; // [TGT], [SRC]
var OP_LIST_JOIN   = 0x49; // [TGT], [SRC1], [SRC2]

function op_nop(b){
	console.log('> NOP');
	b.push(OP_NOP);
}

function op_nil(b, tgt){
	console.log('> NIL ' + tgt.fdiff + ':' + tgt.index);
	b.push(OP_NIL, tgt.fdiff, tgt.index);
}

function op_move(b, tgt, src){
	console.log('> MOVE ' + tgt.fdiff + ':' + tgt.index + ', ' + src.fdiff + ':' + src.index);
	b.push(OP_MOVE, tgt.fdiff, tgt.index, src.fdiff, src.index);
}

function op_num(b, tgt, num){
	console.log('> NUM ' + tgt.fdiff + ':' + tgt.index + ', ' + num);
	if (num >= 0)
		b.push(OP_NUM_POS, tgt.fdiff, tgt.index, num % 256, Math.floor(num / 256));
	else{
		num += 65536;
		b.push(OP_NUM_NEG, tgt.fdiff, tgt.index, num % 256, Math.floor(num / 256));
	}
}

function op_num_tbl(b, tgt, index){
	console.log('> NUM_TBL ' + tgt.fdiff + ':' + tgt.index + ', numTable[' + index + ']');
	b.push(OP_NUM_TBL, tgt.fdiff, tgt.index, index % 256, Math.floor(index / 256));
}

function op_str(b, tgt, index){
	b.push(OP_STR, tgt.fdiff, tgt.index, index % 256, Math.floor(index / 256));
}

function op_unop(b, opcode, tgt, src){
	var opstr = '???';
	if      (opcode == OP_TONUM ) opstr = 'TONUM';
	else if (opcode == OP_NEG   ) opstr = 'NEG';
	else if (opcode == OP_SIZE  ) opstr = 'SIZE';
	else if (opcode == OP_NOT   ) opstr = 'NOT';
	else if (opcode == OP_SHIFT ) opstr = 'SHIFT';
	else if (opcode == OP_POP   ) opstr = 'POP';
	else if (opcode == OP_ISNUM ) opstr = 'ISNUM';
	else if (opcode == OP_ISSTR ) opstr = 'ISSTR';
	else if (opcode == OP_ISLIST) opstr = 'ISLIST';
	console.log('> ' + opstr + ' ' +
		tgt.fdiff + ':' + tgt.index + ', ' +
		src.fdiff + ':' + src.index);
	b.push(opcode, tgt.fdiff, tgt.index, src.fdiff, src.index);
}

function op_binop(b, opcode, tgt, src1, src2){
	var opstr = '???';
	if      (opcode == OP_ADD    ) opstr = 'ADD';
	else if (opcode == OP_SUB    ) opstr = 'SUB';
	else if (opcode == OP_MOD    ) opstr = 'MOD';
	else if (opcode == OP_MUL    ) opstr = 'MUL';
	else if (opcode == OP_DIV    ) opstr = 'DIV';
	else if (opcode == OP_POW    ) opstr = 'POW';
	else if (opcode == OP_LT     ) opstr = 'LT';
	else if (opcode == OP_GT     ) opstr = 'GT';
	else if (opcode == OP_CAT    ) opstr = 'CAT';
	else if (opcode == OP_LTE    ) opstr = 'LTE';
	else if (opcode == OP_GTE    ) opstr = 'GTE';
	else if (opcode == OP_NEQ    ) opstr = 'NEQ';
	else if (opcode == OP_EQU    ) opstr = 'EQU';
	else if (opcode == OP_PUSH   ) opstr = 'PUSH';
	else if (opcode == OP_UNSHIFT) opstr = 'UNSHIFT';
	else if (opcode == OP_APPEND ) opstr = 'APPEND';
	else if (opcode == OP_PREPEND) opstr = 'PREPEND';
	console.log('> ' + opstr + ' ' +
		tgt.fdiff + ':' + tgt.index + ', ' +
		src1.fdiff + ':' + src1.index + ', ' +
		src2.fdiff + ':' + src2.index);
	b.push(opcode, tgt.fdiff, tgt.index, src1.fdiff, src1.index, src2.fdiff, src2.index);
}

function op_getat(b, tgt, src1, src2){
	console.log('> GETAT ' +
		tgt.fdiff + ':' + tgt.index + ', ' +
		src1.fdiff + ':' + src1.index + ', ' +
		src2.fdiff + ':' + src2.index);
	b.push(OP_GETAT, tgt.fdiff, tgt.index, src1.fdiff, src1.index, src2.fdiff, src2.index);
}

function op_setat(b, src1, src2, src3){
	console.log('> SETAT ' +
		src1.fdiff + ':' + src1.index + ', ' +
		src2.fdiff + ':' + src2.index + ', ' +
		src3.fdiff + ':' + src3.index);
	b.push(OP_GETAT, src1.fdiff, src1.index, src2.fdiff, src2.index, src3.fdiff, src3.index);
}

function op_slice(b, tgt, src1, src2, src3){
	console.log('> SLICE ' +
		tgt.fdiff + ':' + tgt.index + ', ' +
		src1.fdiff + ':' + src1.index + ', ' +
		src2.fdiff + ':' + src2.index + ', ' +
		src3.fdiff + ':' + src3.index);
	b.push(OP_SLICE, tgt.fdiff, tgt.index, src1.fdiff, src1.index, src2.fdiff, src2.index,
		src3.fdiff, src3.index);
}

function op_list(b, tgt){
	console.log('> LIST ' + tgt.fdiff + ':' + tgt.index);
	b.push(OP_LIST, tgt.fdiff, tgt.index);
}

function op_param0(b, opcode, tgt){
	b.push(opcode, tgt.fdiff, tgt.index);
}

function op_param1(b, opcode, tgt, src){
	console.log('> 0x' + opcode.toString(16) + ' ' +
		tgt.fdiff + ':' + tgt.index + ', ' +
		src.fdiff + ':' + src.index);
	b.push(opcode, tgt.fdiff, tgt.index, src.fdiff, src.index);
}

function op_param2(b, opcode, tgt, src1, src2){
	b.push(opcode, tgt.fdiff, tgt.index, src1.fdiff, src1.index, src2.fdiff, src2.index);
}

function op_param3(b, opcode, tgt, src1, src2, src3){
	b.push(opcode, tgt.fdiff, tgt.index, src1.fdiff, src1.index, src2.fdiff, src2.index,
		src3.fdiff, src3.index);
}

//
// file position
//

function filepos_new(file, line, chr){
	return { file: file, line: line, chr: chr };
}

function filepos_newCopy(flp){
	return filepos_new(flp.file, flp.line, flp.chr);
}

function filepos_err(flp, msg){
	return (flp.file == null ? '' : flp.file + ':') + flp.line + ':' + flp.chr + ': ' + msg;
}

//
// keywords/specials
//

var KS_INVALID    = 'KS_INVALID';
var KS_PLUS       = 'KS_PLUS';
var KS_MINUS      = 'KS_MINUS';
var KS_PERCENT    = 'KS_PERCENT';
var KS_STAR       = 'KS_STAR';
var KS_SLASH      = 'KS_SLASH';
var KS_CARET      = 'KS_CARET';
var KS_AMP        = 'KS_AMP';
var KS_LT         = 'KS_LT';
var KS_GT         = 'KS_GT';
var KS_BANG       = 'KS_BANG';
var KS_EQU        = 'KS_EQU';
var KS_TILDE      = 'KS_TILDE';
var KS_COLON      = 'KS_COLON';
var KS_COMMA      = 'KS_COMMA';
var KS_PERIOD     = 'KS_PERIOD';
var KS_PIPE       = 'KS_PIPE';
var KS_LPAREN     = 'KS_LPAREN';
var KS_LBRACKET   = 'KS_LBRACKET';
var KS_LBRACE     = 'KS_LBRACE';
var KS_RPAREN     = 'KS_RPAREN';
var KS_RBRACKET   = 'KS_RBRACKET';
var KS_RBRACE     = 'KS_RBRACE';
var KS_PLUSEQU    = 'KS_PLUSEQU';
var KS_MINUSEQU   = 'KS_MINUSEQU';
var KS_PERCENTEQU = 'KS_PERCENTEQU';
var KS_STAREQU    = 'KS_STAREQU';
var KS_SLASHEQU   = 'KS_SLASHEQU';
var KS_CARETEQU   = 'KS_CARETEQU';
var KS_LTEQU      = 'KS_LTEQU';
var KS_GTEQU      = 'KS_GTEQU';
var KS_BANGEQU    = 'KS_BANGEQU';
var KS_EQU2       = 'KS_EQU2';
var KS_TILDEEQU   = 'KS_TILDEEQU';
var KS_TILDEPLUS  = 'KS_TILDEPLUS';
var KS_PLUSTILDE  = 'KS_PLUSTILDE';
var KS_TILDEMINUS = 'KS_TILDEMINUS';
var KS_MINUSTILDE = 'KS_MINUSTILDE';
var KS_AMP2       = 'KS_AMP2';
var KS_PIPE2      = 'KS_PIPE2';
var KS_PERIOD3    = 'KS_PERIOD3';
var KS_TILDE2PLUS = 'KS_TILDE2PLUS';
var KS_PLUSTILDE2 = 'KS_PLUSTILDE2';
var KS_PIPE2EQU   = 'KS_PIPE2EQU';
var KS_AMP2EQU    = 'KS_AMP2EQU';
var KS_BREAK      = 'KS_BREAK';
var KS_CONTINUE   = 'KS_CONTINUE';
var KS_DECLARE    = 'KS_DECLARE';
var KS_DEF        = 'KS_DEF';
var KS_DO         = 'KS_DO';
var KS_ELSE       = 'KS_ELSE';
var KS_ELSEIF     = 'KS_ELSEIF';
var KS_END        = 'KS_END';
var KS_FOR        = 'KS_FOR';
var KS_GOTO       = 'KS_GOTO';
var KS_IF         = 'KS_IF';
var KS_INCLUDE    = 'KS_INCLUDE';
var KS_NAMESPACE  = 'KS_NAMESPACE';
var KS_RETURN     = 'KS_RETURN';
var KS_TYPENUM    = 'KS_TYPENUM';
var KS_TYPESTR    = 'KS_TYPESTR';
var KS_TYPELIST   = 'KS_TYPELIST';
var KS_USING      = 'KS_USING';
var KS_VAR        = 'KS_VAR';
var KS_WHILE      = 'KS_WHILE';

function ks_char(c){
	if      (c == '+') return KS_PLUS;
	else if (c == '-') return KS_MINUS;
	else if (c == '%') return KS_PERCENT;
	else if (c == '*') return KS_STAR;
	else if (c == '/') return KS_SLASH;
	else if (c == '^') return KS_CARET;
	else if (c == '&') return KS_AMP;
	else if (c == '<') return KS_LT;
	else if (c == '>') return KS_GT;
	else if (c == '!') return KS_BANG;
	else if (c == '=') return KS_EQU;
	else if (c == '~') return KS_TILDE;
	else if (c == ':') return KS_COLON;
	else if (c == ',') return KS_COMMA;
	else if (c == '.') return KS_PERIOD;
	else if (c == '|') return KS_PIPE;
	else if (c == '(') return KS_LPAREN;
	else if (c == '[') return KS_LBRACKET;
	else if (c == '{') return KS_LBRACE;
	else if (c == ')') return KS_RPAREN;
	else if (c == ']') return KS_RBRACKET;
	else if (c == '}') return KS_RBRACE;
	return KS_INVALID;
}

function ks_char2(c1, c2){
	if      (c1 == '+' && c2 == '=') return KS_PLUSEQU;
	else if (c1 == '-' && c2 == '=') return KS_MINUSEQU;
	else if (c1 == '%' && c2 == '=') return KS_PERCENTEQU;
	else if (c1 == '*' && c2 == '=') return KS_STAREQU;
	else if (c1 == '/' && c2 == '=') return KS_SLASHEQU;
	else if (c1 == '^' && c2 == '=') return KS_CARETEQU;
	else if (c1 == '<' && c2 == '=') return KS_LTEQU;
	else if (c1 == '>' && c2 == '=') return KS_GTEQU;
	else if (c1 == '!' && c2 == '=') return KS_BANGEQU;
	else if (c1 == '=' && c2 == '=') return KS_EQU2;
	else if (c1 == '~' && c2 == '=') return KS_TILDEEQU;
	else if (c1 == '~' && c2 == '+') return KS_TILDEPLUS;
	else if (c1 == '+' && c2 == '~') return KS_PLUSTILDE;
	else if (c1 == '~' && c2 == '-') return KS_TILDEMINUS;
	else if (c1 == '-' && c2 == '~') return KS_MINUSTILDE;
	else if (c1 == '&' && c2 == '&') return KS_AMP2;
	else if (c1 == '|' && c2 == '|') return KS_PIPE2;
	return KS_INVALID;
}

function ks_char3(c1, c2, c3){
	if      (c1 == '.' && c2 == '.' && c3 == '.') return KS_PERIOD3;
	else if (c1 == '~' && c2 == '~' && c3 == '+') return KS_TILDE2PLUS;
	else if (c1 == '+' && c2 == '~' && c3 == '~') return KS_PLUSTILDE2;
	else if (c1 == '|' && c2 == '|' && c3 == '=') return KS_PIPE2EQU;
	else if (c1 == '&' && c2 == '&' && c3 == '=') return KS_AMP2EQU;
	return KS_INVALID;
}

function ks_str(s){
	if      (s == 'break'    ) return KS_BREAK;
	else if (s == 'continue' ) return KS_CONTINUE;
	else if (s == 'declare'  ) return KS_DECLARE;
	else if (s == 'def'      ) return KS_DEF;
	else if (s == 'do'       ) return KS_DO;
	else if (s == 'else'     ) return KS_ELSE;
	else if (s == 'elseif'   ) return KS_ELSEIF;
	else if (s == 'end'      ) return KS_END;
	else if (s == 'for'      ) return KS_FOR;
	else if (s == 'goto'     ) return KS_GOTO;
	else if (s == 'if'       ) return KS_IF;
	else if (s == 'include'  ) return KS_INCLUDE;
	else if (s == 'namespace') return KS_NAMESPACE;
	else if (s == 'return'   ) return KS_RETURN;
	else if (s == 'typenum'  ) return KS_TYPENUM;
	else if (s == 'typestr'  ) return KS_TYPESTR;
	else if (s == 'typelist' ) return KS_TYPELIST;
	else if (s == 'using'    ) return KS_USING;
	else if (s == 'var'      ) return KS_VAR;
	else if (s == 'while'    ) return KS_WHILE;
	return KS_INVALID;
}

function ks_toUnaryOp(k){
	if      (k == KS_PLUS      ) return OP_TONUM;
	else if (k == KS_MINUS     ) return OP_NEG;
	else if (k == KS_AMP       ) return OP_SIZE;
	else if (k == KS_BANG      ) return OP_NOT;
	else if (k == KS_MINUSTILDE) return OP_SHIFT;
	else if (k == KS_TILDEMINUS) return OP_POP;
	else if (k == KS_TYPENUM   ) return OP_ISNUM;
	else if (k == KS_TYPESTR   ) return OP_ISSTR;
	else if (k == KS_TYPELIST  ) return OP_ISLIST;
	return -1;
}

function ks_toBinaryOp(k){
	if      (k == KS_PLUS   ) return OP_ADD;
	else if (k == KS_MINUS  ) return OP_SUB;
	else if (k == KS_PERCENT) return OP_MOD;
	else if (k == KS_STAR   ) return OP_MUL;
	else if (k == KS_SLASH  ) return OP_DIV;
	else if (k == KS_CARET  ) return OP_POW;
	else if (k == KS_LT     ) return OP_LT;
	else if (k == KS_GT     ) return OP_GT;
	else if (k == KS_TILDE  ) return OP_CAT;
	else if (k == KS_LTEQU  ) return OP_LTE;
	else if (k == KS_GTEQU  ) return OP_GTE;
	else if (k == KS_BANGEQU) return OP_NEQ;
	else if (k == KS_EQU2   ) return OP_EQU;
	return -1;
}

function ks_toMutateOp(k){
	if      (k == KS_TILDEPLUS ) return OP_PUSH;
	else if (k == KS_PLUSTILDE ) return OP_UNSHIFT;
	else if (k == KS_TILDE2PLUS) return OP_APPEND;
	else if (k == KS_PLUSTILDE2) return OP_PREPEND;
	else if (k == KS_PLUSEQU   ) return OP_ADD;
	else if (k == KS_PERCENTEQU) return OP_MOD;
	else if (k == KS_MINUSEQU  ) return OP_SUB;
	else if (k == KS_STAREQU   ) return OP_MUL;
	else if (k == KS_SLASHEQU  ) return OP_DIV;
	else if (k == KS_CARETEQU  ) return OP_POW;
	else if (k == KS_TILDEEQU  ) return OP_CAT;
	return -1;
}

//
// tokens
//

var TOK_NEWLINE = 'TOK_NEWLINE';
var TOK_KS      = 'TOK_KS';
var TOK_IDENT   = 'TOK_IDENT';
var TOK_NUM     = 'TOK_NUM';
var TOK_STR     = 'TOK_STR';
var TOK_ERROR   = 'TOK_ERROR';

function tok_newline(soft){
	return { type: TOK_NEWLINE, soft: soft };
}

function tok_ks(k){
	return { type: TOK_KS, k: k };
}

function tok_ident(ident){
	return { type: TOK_IDENT, ident: ident };
}

function tok_num(num){
	return { type: TOK_NUM, num: num };
}

function tok_str(str){
	return { type: TOK_STR, str: str };
}

function tok_error(msg){
	return { type: TOK_ERROR, msg: msg };
}

function tok_isKS(tk, k){
	return tk.type == TOK_KS && tk.k == k;
}

function tok_isPre(tk){
	if (tk.type == TOK_KS){
		return false ||
			tk.k == KS_PLUS       ||
			tk.k == KS_MINUS      ||
			tk.k == KS_AMP        ||
			tk.k == KS_BANG       ||
			tk.k == KS_PERIOD3    ||
			tk.k == KS_MINUSTILDE ||
			tk.k == KS_TILDEMINUS ||
			tk.k == KS_TYPENUM    ||
			tk.k == KS_TYPESTR    ||
			tk.k == KS_TYPELIST;
	}
	return false;
}

function tok_isMid(tk, allowComma, allowPipe){
	if (tk.type == TOK_KS){
		return false ||
			tk.k == KS_PLUS       ||
			tk.k == KS_PLUSEQU    ||
			tk.k == KS_MINUS      ||
			tk.k == KS_MINUSEQU   ||
			tk.k == KS_PERCENT    ||
			tk.k == KS_PERCENTEQU ||
			tk.k == KS_STAR       ||
			tk.k == KS_STAREQU    ||
			tk.k == KS_SLASH      ||
			tk.k == KS_SLASHEQU   ||
			tk.k == KS_CARET      ||
			tk.k == KS_CARETEQU   ||
			tk.k == KS_LT         ||
			tk.k == KS_LTEQU      ||
			tk.k == KS_GT         ||
			tk.k == KS_GTEQU      ||
			tk.k == KS_BANGEQU    ||
			tk.k == KS_EQU        ||
			tk.k == KS_EQU2       ||
			tk.k == KS_TILDE      ||
			tk.k == KS_TILDEEQU   ||
			tk.k == KS_TILDEPLUS  ||
			tk.k == KS_PLUSTILDE  ||
			tk.k == KS_TILDE2PLUS ||
			tk.k == KS_PLUSTILDE2 ||
			tk.k == KS_AMP2       ||
			tk.k == KS_PIPE2      ||
			tk.k == KS_AMP2EQU    ||
			tk.k == KS_PIPE2EQU   ||
			(allowComma && tk.k == KS_COMMA) ||
			(allowPipe  && tk.k == KS_PIPE );
	}
	return false;
}

function tok_isTerm(tk){
	return false ||
		(tk.type == TOK_KS && (tk.k == KS_LPAREN || tk.k == KS_LBRACE)) ||
		tk.type == TOK_IDENT ||
		tk.type == TOK_NUM   ||
		tk.type == TOK_STR;
}

function tok_isPreBeforeMid(pre, mid){
	//assert(pre.type == TOK_KS);
	//assert(mid.type == TOK_KS);
	// -5^2 is -25, not 25
	if (pre.k == KS_MINUS && mid.k == KS_CARET)
		return false;
	// otherwise, apply the Pre first
	return true;
}

function tok_midPrecedence(tk){
	//assert(tk.type == TOK_KS);
	var k = tk.k;
	if      (k == KS_CARET     ) return  1;
	else if (k == KS_PERCENT   ) return  2;
	else if (k == KS_STAR      ) return  2;
	else if (k == KS_SLASH     ) return  2;
	else if (k == KS_PLUS      ) return  3;
	else if (k == KS_MINUS     ) return  3;
	else if (k == KS_TILDEPLUS ) return  4;
	else if (k == KS_PLUSTILDE ) return  4;
	else if (k == KS_TILDE2PLUS) return  5;
	else if (k == KS_PLUSTILDE2) return  5;
	else if (k == KS_TILDE     ) return  6;
	else if (k == KS_LTEQU     ) return  7;
	else if (k == KS_LT        ) return  7;
	else if (k == KS_GTEQU     ) return  7;
	else if (k == KS_GT        ) return  7;
	else if (k == KS_BANGEQU   ) return  8;
	else if (k == KS_EQU2      ) return  8;
	else if (k == KS_AMP2      ) return  9;
	else if (k == KS_PIPE2     ) return 10;
	else if (k == KS_EQU       ) return 20;
	else if (k == KS_PLUSEQU   ) return 20;
	else if (k == KS_PERCENTEQU) return 20;
	else if (k == KS_MINUSEQU  ) return 20;
	else if (k == KS_STAREQU   ) return 20;
	else if (k == KS_SLASHEQU  ) return 20;
	else if (k == KS_CARETEQU  ) return 20;
	else if (k == KS_TILDEEQU  ) return 20;
	else if (k == KS_COMMA     ) return 30;
	else if (k == KS_PIPE      ) return 40;
	//assert(false);
	return -1;
}

function tok_isMidBeforeMid(lmid, rmid){
	//assert(lmid.type == TOK_KS);
	//assert(rmid.type == TOK_KS);
	var lp = tok_midPrecedence(lmid);
	var rp = tok_midPrecedence(rmid);
	if (lp < rp)
		return true;
	else if (lp > rp)
		return false;
	// otherwise, same precedence...
	if (lp === 20 || lmid.k == KS_CARET) // mutation and pow are right to left
		return false;
	return true;
}

//
// lexer helper functions
//

function isSpace(c){
	return c === ' ' || c === '\n' || c === '\r' || c === '\t';
}

function isAlpha(c){
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

function isNum(c){
	return c >= '0' && c <= '9';
}

function isIdentStart(c){
	return isAlpha(c) || c === '_';
}

function isIdentBody(c){
	return isIdentStart(c) || isNum(c);
}

function isHex(c){
	return isNum(c) || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
}

function toHex(c){
	if (isNum(c))
		return c.charCodeAt(0) - 48;
	else if (c >= 'a')
		return c.charCodeAt(0) - 87;
	return c.charCodeAt(0) - 55;
}

//
// lexer
//

var LEX_START              = 'LEX_START';
var LEX_COMMENT_LINE       = 'LEX_COMMENT_LINE';
var LEX_BACKSLASH          = 'LEX_BACKSLASH';
var LEX_RETURN             = 'LEX_RETURN';
var LEX_COMMENT_BLOCK      = 'LEX_COMMENT_BLOCK';
var LEX_SPECIAL1           = 'LEX_SPECIAL1';
var LEX_SPECIAL2           = 'LEX_SPECIAL2';
var LEX_IDENT              = 'LEX_IDENT';
var LEX_NUM_0              = 'LEX_NUM_0';
var LEX_NUM_2              = 'LEX_NUM_2';
var LEX_NUM                = 'LEX_NUM';
var LEX_NUM_FRAC           = 'LEX_NUM_FRAC';
var LEX_NUM_EXP            = 'LEX_NUM_EXP';
var LEX_NUM_EXP_BODY       = 'LEX_NUM_EXP_BODY';
var LEX_STR_BASIC          = 'LEX_STR_BASIC';
var LEX_STR_BASIC_ESC      = 'LEX_STR_BASIC_ESC';
var LEX_STR_INTERP         = 'LEX_STR_INTERP';
var LEX_STR_INTERP_DLR     = 'LEX_STR_INTERP_DLR';
var LEX_STR_INTERP_DLR_ID  = 'LEX_STR_INTERP_DLR_ID';
var LEX_STR_INTERP_ESC     = 'LEX_STR_INTERP_ESC';
var LEX_STR_INTERP_ESC_HEX = 'LEX_STR_INTERP_ESC_HEX';

function lex_new(){
	return {
		state: LEX_START,
		chR: 0,
		ch1: 0,
		ch2: 0,
		ch3: 0,
		ident: '',
		str: null,
		num_val: 0,
		num_base: 0,
		num_frac: 0,
		num_flen: 0,
		num_esign: 0,
		num_eval: 0,
		num_elen: 0,
		str_depth: 0,
		str_hexval: 0,
		str_hexleft: 0
	};
}

function lex_fwd(lx, ch){
	lx.ch3 = lx.ch2;
	lx.ch2 = lx.ch1;
	lx.ch1 = ch;
}

function lex_rev(lx){
	lx.chR = lx.ch1;
	lx.ch1 = lx.ch2;
	lx.ch2 = lx.ch3;
	lx.ch3 = 0;
}

function lex_process(lx, tks){
	var ch1 = lx.ch1;

	switch (lx.state){
		case LEX_START:
			if (ch1 == '#'){
				lx.state = LEX_COMMENT_LINE;
				tks.push(tok_newline(false));
			}
			else if (ks_char(ch1) != KS_INVALID){
				if (ch1 == '}' && lx.str_depth > 0){
					lx.str_depth--;
					lx.str = [];
					lx.state = LEX_STR_INTERP;
					tks.push(tok_ks(KS_RPAREN));
					tks.push(tok_ks(KS_TILDE));
				}
				else
					lx.state = LEX_SPECIAL1;
			}
			else if (isIdentStart(ch1)){
				lx.ident = ch1;
				lx.state = LEX_IDENT;
			}
			else if (isNum(ch1)){
				lx.num_val = toHex(ch1);
				lx.num_base = 10;
				if (lx.num_val == 0)
					lx.state = LEX_NUM_0;
				else
					lx.state = LEX_NUM;
			}
			else if (ch1 == '\''){
				lx.str = [];
				lx.state = LEX_STR_BASIC;
			}
			else if (ch1 == '"'){
				lx.str = [];
				lx.state = LEX_STR_INTERP;
				tks.push(tok_ks(KS_LPAREN));
			}
			else if (ch1 == '\\')
				lx.state = LEX_BACKSLASH;
			else if (ch1 == '\r'){
				lx.state = LEX_RETURN;
				tks.push(tok_newline(false));
			}
			else if (ch1 == '\n' || ch1 == ';')
				tks.push(tok_newline(ch1 == ';'));
			else if (isSpace(ch1))
				/* do nothing */;
			else
				tks.push(tok_error('Unexpected character: ' + ch1));
			break;

		case LEX_COMMENT_LINE:
			if (ch1 == '\r')
				lx.state = LEX_RETURN;
			else if (ch1 == '\n')
				lx.state = LEX_START;
			break;

		case LEX_BACKSLASH:
			if (ch1 == '#')
				lx.state = LEX_COMMENT_LINE;
			else if (ch1 == '\r')
				lx.state = LEX_RETURN;
			else if (ch1 == '\n')
				lx.state = LEX_START;
			else if (!isSpace(ch1))
				tks.push(tok_error('Invalid character after backslash'));
			break;

		case LEX_RETURN:
			lx.state = LEX_START;
			if (ch1 != '\n')
				lex_process(lx, tks);
			break;

		case LEX_COMMENT_BLOCK:
			if (lx.ch2 == '*' && ch1 == '/')
				lx.state = LEX_START;
			break;

		case LEX_SPECIAL1:
			if (ks_char(ch1) != KS_INVALID){
				if (lx.ch2 == '/' && ch1 == '*')
					lx.state = LEX_COMMENT_BLOCK;
				else
					lx.state = LEX_SPECIAL2;
			}
			else{
				var ks1 = ks_char(lx.ch2);
				if (ks1 != KS_INVALID){
					tks.push(tok_ks(ks1));
					lx.state = LEX_START;
					lex_process(lx, tks);
				}
				else
					tks.push(tok_error('Unexpected characters: ' + lx.ch2 + ch1));
			}
			break;

		case LEX_SPECIAL2: {
			var ks3 = ks_char3(lx.ch3, lx.ch2, ch1);
			if (ks3 != KS_INVALID){
				lx.state = LEX_START;
				tks.push(tok_ks(ks3));
			}
			else{
				var ks2 = ks_char2(lx.ch3, lx.ch2);
				if (ks2 != KS_INVALID){
					tks.push(tok_ks(ks2));
					lx.state = LEX_START;
					lex_process(lx, tks);
				}
				else{
					var ks1 = ks_char(lx.ch3);
					if (ks1 != KS_INVALID){
						tks.push(tok_ks(ks1));
						lx.state = LEX_START;
						lex_rev(lx);
						lex_process(lx, tks);
						lex_fwd(lx, lx.chR);
						lex_process(lx, tks);
					}
					else
						tks.push(tok_error('Unexpected characters: ' + lx.ch3 + lx.ch2 + ch1));
				}
			}
		} break;

		case LEX_IDENT:
			if (!isIdentBody(ch1)){
				var ksk = ks_str(lx.ident);
				if (ksk != KS_INVALID)
					tks.push(tok_ks(ksk));
				else
					tks.push(tok_ident(lx.ident));
				lx.state = LEX_START;
				lex_process(lx, tks);
			}
			else{
				lx.ident += ch1;
				if (lx.ident.length > 1024)
					tks.push(tok_error('Identifier too long'));
			}
			break;

		case LEX_NUM_0:
			if (ch1 == 'b'){
				lx.num_base = 2;
				lx.state = LEX_NUM_2;
			}
			else if (ch1 == 'c'){
				lx.num_base = 8;
				lx.state = LEX_NUM_2;
			}
			else if (ch1 == 'x'){
				lx.num_base = 16;
				lx.state = LEX_NUM_2;
			}
			else if (ch1 == '_')
				lx.state = LEX_NUM;
			else if (ch1 == '.'){
				lx.num_frac = 0;
				lx.num_flen = 0;
				lx.state = LEX_NUM_FRAC;
			}
			else if (ch1 == 'e' || ch1 == 'E'){
				lx.num_frac = 0;
				lx.num_flen = 0;
				lx.num_esign = 0;
				lx.num_eval = 0;
				lx.num_elen = 0;
				lx.state = LEX_NUM_EXP;
			}
			else if (!isIdentStart(ch1)){
				tks.push(tok_num(0));
				lx.state = LEX_START;
				lex_process(lx, tks);
			}
			else
				tks.push(tok_error('Invalid number'));
			break;

		case LEX_NUM_2:
			if (isHex(ch1)){
				lx.num_val = toHex(ch1);
				if (lx.num_val > lx.num_base)
					tks.push(tok_error('Invalid number'));
				else
					lx.state = LEX_NUM;
			}
			else
				tks.push(tok_error('Invalid number'));
			break;

		case LEX_NUM:
			if (ch1 == '_')
				/* do nothing */;
			else if (ch1 == '.'){
				lx.num_frac = 0;
				lx.num_flen = 0;
				lx.state = LEX_NUM_FRAC;
			}
			else if ((lx.num_base == 10 && (ch1 == 'e' || ch1 == 'E')) ||
				(lx.num_base != 10 && (ch1 == 'p' || ch1 == 'P'))){
				lx.num_frac = 0;
				lx.num_flen = 0;
				lx.num_esign = 0;
				lx.num_eval = 0;
				lx.num_elen = 0;
				lx.state = LEX_NUM_EXP;
			}
			else if (isHex(ch1)){
				var v = toHex(ch1);
				if (v > lx.num_base)
					tks.push(tok_error('Invalid number'));
				else
					lx.num_val = lx.num_val * lx.num_base + v;
			}
			else if (!isIdentStart(ch1)){
				tks.push(tok_num(lx.num_val));
				lx.state = LEX_START;
				lex_process(lx, tks);
			}
			else
				tks.push(tok_error('Invalid number'));
			break;

		case LEX_NUM_FRAC:
			if (ch1 == '_')
				/* do nothing */;
			else if ((lx.num_base == 10 && (ch1 == 'e' || ch1 == 'E')) ||
				(lx.num_base != 10 && (ch1 == 'p' || ch1 == 'P'))){
				lx.num_esign = 0;
				lx.num_eval = 0;
				lx.num_elen = 0;
				lx.state = LEX_NUM_EXP;
			}
			else if (isHex(ch1)){
				var v = toHex(ch1);
				if (v > lx.num_base)
					tks.push(tok_error('Invalid number'));
				else{
					lx.num_frac = lx.num_frac * lx.num_base + v;
					lx.num_flen++;
				}
			}
			else if (!isIdentStart(ch1)){
				if (lx.num_flen <= 0)
					tks.push(tok_error('Invalid number'));
				else{
					var d = Math.pow(lx.num_base, lx.num_flen);
					lx.num_val = (lx.num_val * d + lx.num_frac) / d;
					tks.push(tok_num(lx.num_val));
					lx.state = LEX_START;
					lex_process(lx, tks);
				}
			}
			else
				tks.push(tok_error('Invalid number'));
			break;

		case LEX_NUM_EXP:
			if (ch1 != '_'){
				lx.num_esign = ch1 == '-' ? -1 : 1;
				lx.state = LEX_NUM_EXP_BODY;
				if (ch1 != '+' && ch1 != '-')
					lex_process(lx, tks);
			}
			break;

		case LEX_NUM_EXP_BODY:
			if (ch1 == '_')
				/* do nothing */;
			else if (isNum(ch1)){
				lx.num_eval = lx.num_eval * 10 + toHex(ch1);
				lx.num_elen++;
			}
			else if (!isIdentStart(ch1)){
				if (lx.num_elen <= 0)
					tks.push(tok_error('Invalid number'));
				else{
					var e = Math.pow(lx.num_base == 10 ? 10 : 2, lx.num_esign * lx.num_eval);
					lx.num_val *= e;
					if (lx.num_flen > 0){
						var d = Math.pow(lx.num_base, lx.num_flen);
						lx.num_val = (lx.num_val * d + lx.num_frac * e) / d;
					}
					tks.push(tok_num(lx.num_val));
					lx.state = LEX_START;
					lex_process(lx, tks);
				}
			}
			else
				tks.push(tok_error('Invalid number'));
			break;

		case LEX_STR_BASIC:
			if (ch1 == '\r' || ch1 == '\n')
				tks.push(tok_error('Missing end of string'));
			else if (ch1 == '\''){
				lx.state = LEX_START;
				tks.push(tok_ks(KS_LPAREN));
				tks.push(tok_str(lx.str));
				tks.push(tok_ks(KS_RPAREN));
			}
			else if (ch1 == '\\')
				lx.state = LEX_STR_BASIC_ESC;
			else
				lx.str.push(ch1.charCodeAt(0));
			break;

		case LEX_STR_BASIC_ESC:
			if (ch1 == '\\' || ch1 == '\''){
				lx.str.push(ch1.charCodeAt(0));
				lx.state = LEX_STR_BASIC;
			}
			else
				tks.push(tok_error('Invalid escape sequence: \\' + ch1));
			break;

		case LEX_STR_INTERP:
			if (ch1 == '\r' || ch1 == '\n')
				tks.push(tok_error('Missing end of string'));
			else if (ch1 == '"'){
				lx.state = LEX_START;
				tks.push(tok_str(lx.str));
				tks.push(tok_ks(KS_RPAREN));
			}
			else if (ch1 == '$'){
				lx.state = LEX_STR_INTERP_DLR;
				if (lx.str.length > 0){
					tks.push(tok_str(lx.str));
					tks.push(tok_ks(KS_TILDE));
				}
			}
			else if (ch1 == '\\')
				lx.state = LEX_STR_INTERP_ESC;
			else
				lx.str.push(ch1.charCodeAt(0));
			break;

		case LEX_STR_INTERP_DLR:
			if (ch1 == '{'){
				lx.str_depth++;
				lx.state = LEX_START;
				tks.push(tok_ks(KS_LPAREN));
			}
			else if (isIdentStart(ch1)){
				lx.ident = ch1;
				lx.state = LEX_STR_INTERP_DLR_ID;
			}
			else
				tks.push(tok_error('Invalid substitution'));
			break;

		case LEX_STR_INTERP_DLR_ID:
			if (!isIdentBody(ch1)){
				if (ks_str(lx.ident) != KS_INVALID)
					tks.push(tok_error('Invalid substitution'));
				else{
					tks.push(tok_ident(lx.ident));
					if (ch1 == '"'){
						lx.state = LEX_START;
						tks.push(tok_ks(KS_RPAREN));
					}
					else{
						lx.str = [];
						lx.state = LEX_STR_INTERP;
						tks.push(tok_ks(KS_TILDE));
						lex_process(lx, tks);
					}
				}
			}
			else{
				lx.ident += ch1;
				if (lx.ident.length > 1024)
					tks.push(tok_error('Identifier too long'));
			}
			break;

		case LEX_STR_INTERP_ESC:
			if (ch1 == '\r' || ch1 == '\n')
				tks.push(tok_error('Missing end of string'));
			else if (ch1 == 'x'){
				lx.str_hexval = 0;
				lx.str_hexleft = 2;
				lx.state = LEX_STR_INTERP_ESC_HEX;
			}
			else if (ch1 == '0'){
				lx.str.push(0);
				lx.state = LEX_STR_INTERP;
			}
			else if (ch1 == 'b'){
				lx.str.push(8);
				lx.state = LEX_STR_INTERP;
			}
			else if (ch1 == 't'){
				lx.str.push(9);
				lx.state = LEX_STR_INTERP;
			}
			else if (ch1 == 'n'){
				lx.str.push(10);
				lx.state = LEX_STR_INTERP;
			}
			else if (ch1 == 'v'){
				lx.str.push(11);
				lx.state = LEX_STR_INTERP;
			}
			else if (ch1 == 'f'){
				lx.str.push(12);
				lx.state = LEX_STR_INTERP;
			}
			else if (ch1 == 'r'){
				lx.str.push(13);
				lx.state = LEX_STR_INTERP;
			}
			else if (ch1 == '\\' || ch1 == '\'' || ch1 == '"' || ch1 == '$'){
				lx.str.push(ch1.charCodeAt(0));
				lx.state = LEX_STR_INTERP;
			}
			else
				tks.push(tok_error('Invalid escape sequence: \\' + ch1));
			break;

		case LEX_STR_INTERP_ESC_HEX:
			if (isHex(ch1)){
				lx.str_hexval = (str_hexval * 16) + toHex(ch1);
				lx.str_hexleft--;
				if (lx.str_hexleft <= 0){
					lx.str.push(lx.str_hexval);
					lx.state = LEX_STR_INTERP;
				}
			}
			else
				tks.push(tok_error('Invalid escape sequence; expecting hex value'));
			break;
	}
}

function lex_add(lx, ch, tks){
	lex_fwd(lx, ch);
	return lex_process(lx, tks);
}

function lex_close(lx, tks){
	if (lx.str_depth > 0){
		tks.push(tok_error('Missing end of string'));
		return;
	}
	switch (lx.state){
		case LEX_START:
		case LEX_COMMENT_LINE:
		case LEX_BACKSLASH:
		case LEX_RETURN:
			break;

		case LEX_COMMENT_BLOCK:
			tks.push(tok_error('Missing end of block comment'));
			return;

		case LEX_SPECIAL1: {
			var ks1 = ks_char(lx.ch1);
			if (ks1 != KS_INVALID)
				tks.push(tok_ks(ks1));
			else
				tks.push(tok_error('Unexpected character: ' + lx.ch1));
		} break;

		case LEX_SPECIAL2: {
			var ks2 = ks_char2(lx.ch2, lx.ch1);
			if (ks2 != KS_INVALID)
				tks.push(tok_ks(ks2))
			else{
				var ks1 = ks_char(lx.ch2);
				ks2 = ks_char(lx.ch1);
				if (ks1 != KS_INVALID){
					tks.push(tok_ks(ks1));
					if (ks2 != KS_INVALID)
						tks.push(tok_ks(ks2));
					else
						tks.push(tok_error('Unexpected character: ' + lx.ch1));
				}
				else
					tks.push(tok_error('Unexpected character: ' + lx.ch2));
			}
		} break;

		case LEX_IDENT: {
			var ksk = ks_str(lx.ident);
			if (ksk != KS_INVALID)
				tks.push(tok_ks(ksk));
			else
				tks.push(tok_ident(lx.ident));
		} break;

		case LEX_NUM_0:
			tks.push(tok_num(0));
			break;

		case LEX_NUM_2:
			tks.push(tok_error('Invalid number'));
			break;

		case LEX_NUM:
			tks.push(tok_num(lx.num_val));
			break;

		case LEX_NUM_FRAC:
			if (lx.num_flen <= 0)
				tks.push(tok_error('Invalid number'));
			else{
				var d = Math.pow(lx.num_base, lx.num_flen);
				lx.num_val = (lx.num_val * d + lx.num_frac) / d;
				tks.push(tok_num(lx.num_val));
			}
			break;

		case LEX_NUM_EXP:
			tks.push(tok_error('Invalid number'));
			break;

		case LEX_NUM_EXP_BODY:
			if (lx.num_elen <= 0)
				tks.push(tok_error('Invalid number'));
			else{
				var e = Math.pow(lx.num_base == 10 ? 10 : 2, lx.num_esign * lx.num_eval);
				lx.num_val *= e;
				if (lx.num_flen > 0){
					var d = Math.pow(lx.num_base, lx.num_flen);
					lx.num_val = (lx.num_val * d + lx.num_frac * e) / d;
				}
				tks.push(tok_num(lx.num_val));
			}
			break;

		case LEX_STR_BASIC:
		case LEX_STR_BASIC_ESC:
		case LEX_STR_INTERP:
		case LEX_STR_INTERP_DLR:
		case LEX_STR_INTERP_DLR_ID:
		case LEX_STR_INTERP_ESC:
		case LEX_STR_INTERP_ESC_HEX:
			tks.push(tok_error('Missing end of string'));
			break;
	}
	tks.push(tok_newline(false));
}

//
// expr
//

var EXPR_NIL    = 'EXPR_NIL';
var EXPR_NUM    = 'EXPR_NUM';
var EXPR_STR    = 'EXPR_STR';
var EXPR_LIST   = 'EXPR_LIST';
var EXPR_NAMES  = 'EXPR_NAMES';
var EXPR_VAR    = 'EXPR_VAR';
var EXPR_PAREN  = 'EXPR_PAREN';
var EXPR_GROUP  = 'EXPR_GROUP';
var EXPR_PREFIX = 'EXPR_PREFIX';
var EXPR_INFIX  = 'EXPR_INFIX';
var EXPR_CALL   = 'EXPR_CALL';
var EXPR_INDEX  = 'EXPR_INDEX';
var EXPR_SLICE  = 'EXPR_SLICE';

function expr_nil(flp){
	return { flp: flp, type: EXPR_NIL };
}

function expr_num(flp, num){
	return { flp: flp, type: EXPR_NUM, num: num };
}

function expr_str(flp, str){
	return { flp: flp, type: EXPR_STR, str: str };
}

function expr_list(flp, ex){
	return { flp: flp, type: EXPR_LIST, ex: ex };
}

function expr_names(flp, names){
	return { flp: flp, type: EXPR_NAMES, names: names };
}

function expr_var(flp, vlc){
	return { flp: flp, type: EXPR_VAR, vlc: vlc };
}

function expr_paren(flp, ex){
	return { flp: flp, type: EXPR_PAREN, ex: ex };
}

function expr_group(flp, left, right){
	if (left.type == EXPR_GROUP){
		if (right.type == EXPR_GROUP)
			return { flp: flp, type: EXPR_GROUP, group: left.group.concat(right.group) };
		var g = left.group.concat();
		g.push(right);
		return { flp: flp, type: EXPR_GROUP, group: g };
	}
	else if (right.type == EXPR_GROUP){
		var g = right.group.concat();
		g.unshift(left);
		return { flp: flp, type: EXPR_GROUP, group: g };
	}
	return { flp: flp, type: EXPR_GROUP, group: [left, right] };
}

function expr_prefix(flp, k, ex){
	if (k == KS_MINUS && ex.type == EXPR_NUM)
		return expr_num(flp, -ex.num);
	else if (k == KS_PLUS && ex.type == EXPR_NUM)
		return ex;
	return { flp: flp, type: EXPR_PREFIX, k: k, ex: ex };
}

function expr_infix(flp, k, left, right){
	if (k == KS_COMMA)
		return expr_group(flp, left, right);
	return { flp: flp, type: EXPR_INFIX, k: k, left: left, right: right };
}

function expr_call(flp, cmd, params){
	return { flp: flp, type: EXPR_CALL, cmd: cmd, params: params };
}

function expr_index(flp, obj, key){
	return { flp: flp, type: EXPR_INDEX, obj: obj, key: key };
}

function expr_slice(flp, obj, start, len){
	return { flp: flp, type: EXPR_SLICE, obj: obj, start: start, len: len };
}

//
// ast
//

var AST_BREAK     = 'AST_BREAK';
var AST_CONTINUE  = 'AST_CONTINUE';
var AST_DECLARE   = 'AST_DECLARE';
var AST_DEF       = 'AST_DEF';
var AST_DO_END    = 'AST_DO_END';
var AST_DO_WHILE  = 'AST_DO_WHILE';
var AST_FOR       = 'AST_FOR';
var AST_LOOP      = 'AST_LOOP';
var AST_GOTO      = 'AST_GOTO';
var AST_IF        = 'AST_IF';
var AST_INCLUDE   = 'AST_INCLUDE';
var AST_NAMESPACE = 'AST_NAMESPACE';
var AST_RETURN    = 'AST_RETURN';
var AST_USING     = 'AST_USING';
var AST_VAR       = 'AST_VAR';
var AST_EVAL      = 'AST_EVAL';
var AST_LABEL     = 'AST_LABEL';

function ast_break(flp){
	return { flp: flp, type: AST_BREAK };
}

function ast_continue(flp){
	return { flp: flp, type: AST_CONTINUE };
}

function ast_declare(flp, decls){
	return { flp: flp, type: AST_DECLARE, decls: decls };
}

function ast_def(flp, names, lvalues, body){
	return { flp: flp, type: AST_DEF, names: names, lvalues: lvalues, body: body };
}

function ast_doEnd(flp, body){
	return { flp: flp, type: AST_DO_END, body: body };
}

function ast_doWhile(flp, doBody, cond, whileBody){
	return { flp: flp, type: AST_DO_WHILE, doBody: doBody, cond: cond, whileBody: whileBody };
}

function ast_for(flp, forVar, names1, names2, ex, body){
	return {
		flp: flp,
		type: AST_FOR,
		forVar: forVar,
		names1: names1,
		names2: names2,
		ex: ex,
		body: body
	};
}

function ast_loop(flp, body){
	return { flp: flp, type: AST_LOOP, body: body };
}

function ast_goto(flp, ident){
	return { flp: flp, type: AST_GOTO, ident: ident };
}

function ast_if(flp, conds, elseBody){
	return { flp: flp, type: AST_IF, conds: conds, elseBody: elseBody };
}

function ast_include(flp, file){
	return { flp: flp, type: AST_INCLUDE, file: file };
}

function ast_namespace(flp, names, body){
	return { flp: flp, type: AST_NAMESPACE, names: names, body: body };
}

function ast_return(flp, ex){
	return { flp: flp, type: AST_RETURN, ex: ex };
}

function ast_using(flp, namesList){
	return { flp: flp, type: AST_USING, namesList: namesList };
}

function ast_var(flp, lvalues){
	return { flp: flp, type: AST_VAR, lvalues: lvalues };
}

function ast_eval(flp, ex){
	return { flp: flp, type: AST_EVAL, ex: ex };
}

function ast_label(flp, ident){
	return { flp: flp, type: AST_LABEL, ident: ident };
}

//
// parser state helpers
//

function cond_new(ex, body){ // conds
	return { ex: ex, body: body };
}

var DECL_LOCAL  = 'DECL_LOCAL';
var DECL_NATIVE = 'DECL_NATIVE';

function decl_local(flp, names){
	return { flp: flp, type: DECL_LOCAL, names: names };
}

function decl_native(flp, names, key){
	return { flp: flp, type: DECL_NATIVE, names: names, key: key };
}

function ets_new(tk, next){ // exprPreStack, exprMidStack
	return { tk: tk, next: next };
}

function exs_new(ex, next){ // exprStack
	return { ex: ex, next: next };
}

function eps_new(ets, next){ // exprPreStackStack
	return { ets: ets, next: next };
}

//
// parser state
//

var PRS_START                         = 'PRS_START';
var PRS_START_STATEMENT               = 'PRS_START_STATEMENT';
var PRS_STATEMENT                     = 'PRS_STATEMENT';
var PRS_LOOKUP                        = 'PRS_LOOKUP';
var PRS_LOOKUP_IDENT                  = 'PRS_LOOKUP_IDENT';
var PRS_BODY                          = 'PRS_BODY';
var PRS_BODY_STATEMENT                = 'PRS_BODY_STATEMENT';
var PRS_LVALUES                       = 'PRS_LVALUES';
var PRS_LVALUES_TERM                  = 'PRS_LVALUES_TERM';
var PRS_LVALUES_TERM_LOOKUP           = 'PRS_LVALUES_TERM_LOOKUP';
var PRS_LVALUES_TERM_LIST             = 'PRS_LVALUES_TERM_LIST';
var PRS_LVALUES_TERM_LIST_TERM_DONE   = 'PRS_LVALUES_TERM_LIST_TERM_DONE';
var PRS_LVALUES_TERM_LIST_TAIL        = 'PRS_LVALUES_TERM_LIST_TAIL';
var PRS_LVALUES_TERM_LIST_TAIL_LOOKUP = 'PRS_LVALUES_TERM_LIST_TAIL_LOOKUP';
var PRS_LVALUES_TERM_LIST_TAIL_DONE   = 'PRS_LVALUES_TERM_LIST_TAIL_DONE';
var PRS_LVALUES_TERM_LIST_DONE        = 'PRS_LVALUES_TERM_LIST_DONE';
var PRS_LVALUES_TERM_DONE             = 'PRS_LVALUES_TERM_DONE';
var PRS_LVALUES_TERM_EXPR             = 'PRS_LVALUES_TERM_EXPR';
var PRS_LVALUES_MORE                  = 'PRS_LVALUES_MORE';
var PRS_LVALUES_DEF_TAIL              = 'PRS_LVALUES_DEF_TAIL';
var PRS_LVALUES_DEF_TAIL_DONE         = 'PRS_LVALUES_DEF_TAIL_DONE';
var PRS_BREAK                         = 'PRS_BREAK';
var PRS_CONTINUE                      = 'PRS_CONTINUE';
var PRS_DECLARE                       = 'PRS_DECLARE';
var PRS_DECLARE2                      = 'PRS_DECLARE2';
var PRS_DECLARE_LOOKUP                = 'PRS_DECLARE_LOOKUP';
var PRS_DECLARE_STR                   = 'PRS_DECLARE_STR';
var PRS_DECLARE_STR2                  = 'PRS_DECLARE_STR2';
var PRS_DECLARE_STR3                  = 'PRS_DECLARE_STR3';
var PRS_DEF                           = 'PRS_DEF';
var PRS_DEF_LOOKUP                    = 'PRS_DEF_LOOKUP';
var PRS_DEF_LVALUES                   = 'PRS_DEF_LVALUES';
var PRS_DEF_BODY                      = 'PRS_DEF_BODY';
var PRS_DEF_DONE                      = 'PRS_DEF_DONE';
var PRS_DO                            = 'PRS_DO';
var PRS_DO_BODY                       = 'PRS_DO_BODY';
var PRS_DO_DONE                       = 'PRS_DO_DONE';
var PRS_DO_WHILE_EXPR                 = 'PRS_DO_WHILE_EXPR';
var PRS_DO_WHILE_BODY                 = 'PRS_DO_WHILE_BODY';
var PRS_DO_WHILE_DONE                 = 'PRS_DO_WHILE_DONE';
var PRS_FOR                           = 'PRS_FOR';
var PRS_LOOP_BODY                     = 'PRS_LOOP_BODY';
var PRS_LOOP_DONE                     = 'PRS_LOOP_DONE';
var PRS_FOR_VARS                      = 'PRS_FOR_VARS';
var PRS_FOR_VARS_LOOKUP               = 'PRS_FOR_VARS_LOOKUP';
var PRS_FOR_VARS2                     = 'PRS_FOR_VARS2';
var PRS_FOR_VARS2_LOOKUP              = 'PRS_FOR_VARS2_LOOKUP';
var PRS_FOR_VARS_DONE                 = 'PRS_FOR_VARS_DONE';
var PRS_FOR_EXPR                      = 'PRS_FOR_EXPR';
var PRS_FOR_BODY                      = 'PRS_FOR_BODY';
var PRS_FOR_DONE                      = 'PRS_FOR_DONE';
var PRS_GOTO                          = 'PRS_GOTO';
var PRS_GOTO_DONE                     = 'PRS_GOTO_DONE';
var PRS_IF                            = 'PRS_IF';
var PRS_IF_EXPR                       = 'PRS_IF_EXPR';
var PRS_IF_BODY                       = 'PRS_IF_BODY';
var PRS_ELSEIF                        = 'PRS_ELSEIF';
var PRS_IF_DONE                       = 'PRS_IF_DONE';
var PRS_ELSE_BODY                     = 'PRS_ELSE_BODY';
var PRS_ELSE_DONE                     = 'PRS_ELSE_DONE';
var PRS_INCLUDE                       = 'PRS_INCLUDE';
var PRS_INCLUDE_STR                   = 'PRS_INCLUDE_STR';
var PRS_INCLUDE_STR2                  = 'PRS_INCLUDE_STR2';
var PRS_INCLUDE_DONE                  = 'PRS_INCLUDE_DONE';
var PRS_NAMESPACE                     = 'PRS_NAMESPACE';
var PRS_NAMESPACE_LOOKUP              = 'PRS_NAMESPACE_LOOKUP';
var PRS_NAMESPACE_BODY                = 'PRS_NAMESPACE_BODY';
var PRS_NAMESPACE_DONE                = 'PRS_NAMESPACE_DONE';
var PRS_RETURN                        = 'PRS_RETURN';
var PRS_RETURN_DONE                   = 'PRS_RETURN_DONE';
var PRS_USING                         = 'PRS_USING';
var PRS_USING2                        = 'PRS_USING2';
var PRS_USING_LOOKUP                  = 'PRS_USING_LOOKUP';
var PRS_VAR                           = 'PRS_VAR';
var PRS_VAR_LVALUES                   = 'PRS_VAR_LVALUES';
var PRS_IDENTS                        = 'PRS_IDENTS';
var PRS_EVAL                          = 'PRS_EVAL';
var PRS_EVAL_EXPR                     = 'PRS_EVAL_EXPR';
var PRS_EXPR                          = 'PRS_EXPR';
var PRS_EXPR_TERM                     = 'PRS_EXPR_TERM';
var PRS_EXPR_TERM_ISEMPTYLIST         = 'PRS_EXPR_TERM_ISEMPTYLIST';
var PRS_EXPR_TERM_CLOSEBRACE          = 'PRS_EXPR_TERM_CLOSEBRACE';
var PRS_EXPR_TERM_ISNIL               = 'PRS_EXPR_TERM_ISNIL';
var PRS_EXPR_TERM_CLOSEPAREN          = 'PRS_EXPR_TERM_CLOSEPAREN';
var PRS_EXPR_TERM_LOOKUP              = 'PRS_EXPR_TERM_LOOKUP';
var PRS_EXPR_POST                     = 'PRS_EXPR_POST';
var PRS_EXPR_POST_CALL                = 'PRS_EXPR_POST_CALL';
var PRS_EXPR_INDEX_CHECK              = 'PRS_EXPR_INDEX_CHECK';
var PRS_EXPR_INDEX_COLON_CHECK        = 'PRS_EXPR_INDEX_COLON_CHECK';
var PRS_EXPR_INDEX_COLON_EXPR         = 'PRS_EXPR_INDEX_COLON_EXPR';
var PRS_EXPR_INDEX_EXPR_CHECK         = 'PRS_EXPR_INDEX_EXPR_CHECK';
var PRS_EXPR_INDEX_EXPR_COLON_CHECK   = 'PRS_EXPR_INDEX_EXPR_COLON_CHECK';
var PRS_EXPR_INDEX_EXPR_COLON_EXPR    = 'PRS_EXPR_INDEX_EXPR_COLON_EXPR';
var PRS_EXPR_COMMA                    = 'PRS_EXPR_COMMA';
var PRS_EXPR_MID                      = 'PRS_EXPR_MID';
var PRS_EXPR_FINISH                   = 'PRS_EXPR_FINISH';

function prs_new(state, next){
	return {
		state: state,
		stmt: null,                 // single ast_*
		body: null,                 // list of ast_*'s
		body2: null,                // list of ast_*'s
		conds: null,                // list of cond_new's
		decls: null,                // list of decl_*'s
		lvalues: null,              // list of expr
		lvaluesPeriods: 0,          // 0 off, 1 def, 2 nested list
		forVar: false,
		str: null,
		exprAllowComma: true,
		exprAllowPipe: true,
		exprAllowTrailComma: false,
		exprPreStackStack: null,    // linked list of eps_new's
		exprPreStack: null,         // linked list of ets_new's
		exprMidStack: null,         // linked list of ets_new's
		exprStack: null,            // linked list of exs_new's
		exprTerm: null,             // expr
		exprTerm2: null,            // expr
		exprTerm3: null,            // expr
		names: null,                // list of strings
		names2: null,               // list of strings
		namesList: null,            // list of list of strings
		next: next
	};
}

//
// parser
//

function parser_new(){
	return {
		state: prs_new(PRS_START, null),
		tkR: null,
		tk1: null,
		tk2: null,
		level: 0
	};
}

function parser_fwd(pr, tk){
	pr.tk2 = pr.tk1;
	pr.tk1 = tk;
	pr.tkR = null;
}

function parser_rev(pr){
	pr.tkR = pr.tk1;
	pr.tk1 = pr.tk2;
	pr.tk2 = null;
}

function parser_statement(pr, stmt){
	pr.level--;
	pr.state = pr.state.next;
	pr.state.stmt = stmt;
	return parser_process(pr, stmt.flp);
}

function parser_push(pr, state){
	pr.state = prs_new(state, pr.state);
}

var PRI_OK    = 'PRI_OK';
var PRI_ERROR = 'PRI_ERROR';

function pri_ok(ex){
	return { type: PRI_OK, ex: ex };
}

function pri_error(msg){
	return { type: PRI_ERROR, msg: msg };
}

function parser_infix(flp, k, left, right){
	if (k == KS_PIPE){
		if (right.type == EXPR_CALL){
			right.params = expr_infix(flp, KS_COMMA, expr_paren(flp, left), right.params);
			return pri_ok(right);
		}
		else if (right.type == EXPR_NAMES)
			return pri_ok(expr_call(flp, right, left));
		return pri_error('Invalid pipe');
	}
	return pri_ok(expr_infix(flp, k, left, right));
}

var PRR_MORE      = 'PRR_MORE';
var PRR_STATEMENT = 'PRR_STATEMENT';
var PRR_ERROR     = 'PRR_ERROR';

function prr_more(){
	return { type: PRR_MORE };
}

function prr_statement(stmt){
	return { type: PRR_STATEMENT, stmt: stmt };
}

function prr_error(msg){
	return { type: PRR_ERROR, msg: msg };
}

function parser_start(pr, state){
	pr.level++;
	pr.state.state = state;
	return prr_more();
}

function parser_process(pr, flp){
	var tk1 = pr.tk1;
	var st = pr.state;
	switch (st.state){
		case PRS_START:
			st.state = PRS_START_STATEMENT;
			st.stmt = null;
			parser_push(pr, PRS_STATEMENT);
			return parser_process(pr, flp);

		case PRS_START_STATEMENT:
			if (st.stmt == null)
				return prr_error('Invalid statement');
			// all statements require a newline to terminate it... except labels
			if (st.stmt.type != AST_LABEL && tk1.type != TOK_NEWLINE)
				return prr_error('Missing newline or semicolon');
			st.state = PRS_START;
			return prr_statement(st.stmt);

		case PRS_STATEMENT:
			if      (tk1.type == TOK_NEWLINE    ) return prr_more();
			else if (tok_isKS(tk1, KS_BREAK    )) return parser_start(pr, PRS_BREAK    );
			else if (tok_isKS(tk1, KS_CONTINUE )) return parser_start(pr, PRS_CONTINUE );
			else if (tok_isKS(tk1, KS_DECLARE  )) return parser_start(pr, PRS_DECLARE  );
			else if (tok_isKS(tk1, KS_DEF      )) return parser_start(pr, PRS_DEF      );
			else if (tok_isKS(tk1, KS_DO       )) return parser_start(pr, PRS_DO       );
			else if (tok_isKS(tk1, KS_FOR      )) return parser_start(pr, PRS_FOR      );
			else if (tok_isKS(tk1, KS_GOTO     )) return parser_start(pr, PRS_GOTO     );
			else if (tok_isKS(tk1, KS_IF       )) return parser_start(pr, PRS_IF       );
			else if (tok_isKS(tk1, KS_INCLUDE  )) return parser_start(pr, PRS_INCLUDE  );
			else if (tok_isKS(tk1, KS_NAMESPACE)) return parser_start(pr, PRS_NAMESPACE);
			else if (tok_isKS(tk1, KS_RETURN   )) return parser_start(pr, PRS_RETURN   );
			else if (tok_isKS(tk1, KS_USING    )) return parser_start(pr, PRS_USING    );
			else if (tok_isKS(tk1, KS_VAR      )) return parser_start(pr, PRS_VAR      );
			else if (tk1.type == TOK_IDENT){
				st.state = PRS_IDENTS;
				parser_push(pr, PRS_LOOKUP);
				pr.state.names = [tk1.ident];
				return prr_more();
			}
			else if (tok_isPre(tk1) || tok_isTerm(tk1)){
				pr.level++;
				st.state = PRS_EVAL;
				return parser_process(pr, flp);
			}
			else if (tok_isKS(tk1, KS_END) || tok_isKS(tk1, KS_ELSE) || tok_isKS(tk1, KS_ELSEIF) ||
				tok_isKS(tk1, KS_WHILE)){
				// stmt is already null, so don't touch it, so we return null
				pr.state = st.next;
				return parser_process(pr, flp);
			}
			return prr_error('Invalid statement');

		case PRS_LOOKUP:
			if (!tok_isKS(tk1, KS_PERIOD)){
				st.next.names = st.names;
				pr.state = st.next;
				return parser_process(pr, flp);
			}
			st.state = PRS_LOOKUP_IDENT;
			return prr_more();

		case PRS_LOOKUP_IDENT:
			if (tk1.type != TOK_IDENT)
				return prr_error('Expecting identifier');
			st.names.push(tk1.ident);
			st.state = PRS_LOOKUP;
			return prr_more();

		case PRS_BODY:
			st.state = PRS_BODY_STATEMENT;
			st.stmt = null;
			parser_push(pr, PRS_STATEMENT);
			return parser_process(pr, flp);

		case PRS_BODY_STATEMENT:
			if (st.stmt == null){
				st.next.body = st.body;
				pr.state = st.next;
				return parser_process(pr, flp);
			}
			st.body.push(st.stmt);
			st.stmt = null;
			parser_push(pr, PRS_STATEMENT);
			return prr_more();

		case PRS_LVALUES:
			if (tk1.type == TOK_NEWLINE && !tk1.soft){
				st.next.lvalues = st.lvalues;
				pr.state = st.next;
				return parser_process(pr, flp);
			}
			st.state = PRS_LVALUES_TERM_DONE;
			parser_push(pr, PRS_LVALUES_TERM);
			pr.state.lvaluesPeriods = st.lvaluesPeriods;
			return parser_process(pr, flp);

		case PRS_LVALUES_TERM:
			if (tk1.type == TOK_IDENT){
				st.state = PRS_LVALUES_TERM_LOOKUP;
				parser_push(pr, PRS_LOOKUP);
				pr.state.names = [tk1.ident];
				return prr_more();
			}
			else if (tok_isKS(tk1, KS_LBRACE)){
				st.state = PRS_LVALUES_TERM_LIST_DONE;
				parser_push(pr, PRS_LVALUES_TERM_LIST);
				return prr_more();
			}
			else if (st.lvaluesPeriods > 0 && tok_isKS(tk1, KS_PERIOD3)){
				if (st.lvaluesPeriods == 1)
					st.state = PRS_LVALUES_DEF_TAIL;
				else
					st.state = PRS_LVALUES_TERM_LIST_TAIL;
				return prr_more();
			}
			return prr_error('Expecting variable');

		case PRS_LVALUES_TERM_LOOKUP:
			st.next.exprTerm = expr_names(flp, st.names);
			pr.state = st.next;
			return parser_process(pr, flp);

		case PRS_LVALUES_TERM_LIST:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			else if (tok_isKS(tk1, KS_RBRACE)){
				st.next.exprTerm = st.exprTerm;
				pr.state = st.next;
				return prr_more();
			}
			st.state = PRS_LVALUES_TERM_LIST_TERM_DONE;
			parser_push(pr, PRS_LVALUES_TERM);
			pr.state.lvaluesPeriods = 2;
			return parser_process(pr, flp);

		case PRS_LVALUES_TERM_LIST_TERM_DONE:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			if (st.exprTerm2 == null){
				st.exprTerm2 = st.exprTerm;
				st.exprTerm = null;
			}
			else{
				st.exprTerm2 = expr_infix(flp, KS_COMMA, st.exprTerm2, st.exprTerm);
				st.exprTerm = null;
			}
			if (tok_isKS(tk1, KS_RBRACE)){
				st.next.exprTerm = st.exprTerm2;
				pr.state = st.next;
				return prr_more();
			}
			else if (tok_isKS(tk1, KS_COMMA)){
				parser_push(pr, PRS_LVALUES_TERM);
				pr.state.lvaluesPeriods = 2;
				return prr_more();
			}
			return prr_error('Invalid list');

		case PRS_LVALUES_TERM_LIST_TAIL:
			if (tk1.type != TOK_IDENT)
				return prr_error('Expecting identifier');
			st.state = PRS_LVALUES_TERM_LIST_TAIL_LOOKUP;
			parser_push(pr, PRS_LOOKUP);
			pr.state.names = [tk1.ident];
			return prr_more();

		case PRS_LVALUES_TERM_LIST_TAIL_LOOKUP:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			st.state = PRS_LVALUES_TERM_LIST_TAIL_DONE;
			if (tok_isKS(tk1, KS_COMMA))
				return prr_more();
			return parser_process(pr, flp);

		case PRS_LVALUES_TERM_LIST_TAIL_DONE:
			if (!tok_isKS(tk1, KS_RBRACE))
				return prr_error('Missing end of list');
			st.next.exprTerm = expr_prefix(flp, KS_PERIOD3, expr_names(flp, st.names));
			pr.state = st.next;
			return parser_process(pr, flp);

		case PRS_LVALUES_TERM_LIST_DONE:
			st.next.exprTerm = expr_list(flp, st.exprTerm);
			pr.state = st.next;
			return parser_process(pr, flp);

		case PRS_LVALUES_TERM_DONE:
			if (tk1.type == TOK_NEWLINE){
				st.lvalues.push(expr_infix(flp, KS_EQU, st.exprTerm, null));
				st.exprTerm = null;
				st.next.lvalues = st.lvalues;
				pr.state = st.next;
				return parser_process(pr, flp);
			}
			else if (tok_isKS(tk1, KS_EQU)){
				st.exprTerm2 = st.exprTerm;
				st.exprTerm = null;
				st.state = PRS_LVALUES_TERM_EXPR;
				parser_push(pr, PRS_EXPR);
				pr.state.exprAllowComma = false;
				return prr_more();
			}
			else if (tok_isKS(tk1, KS_COMMA)){
				st.lvalues.push(expr_infix(flp, KS_EQU, st.exprTerm, null));
				st.exprTerm = null;
				st.state = PRS_LVALUES_MORE;
				return prr_more();
			}
			return prr_error('Invalid declaration');

		case PRS_LVALUES_TERM_EXPR:
			st.lvalues.push(expr_infix(flp, KS_EQU, st.exprTerm2, st.exprTerm));
			st.exprTerm2 = null;
			st.exprTerm = null;
			if (tk1.type == TOK_NEWLINE){
				st.next.lvalues = st.lvalues;
				pr.state = st.next;
				return parser_process(pr, flp);
			}
			else if (tok_isKS(tk1, KS_COMMA)){
				st.state = PRS_LVALUES_MORE;
				return prr_more();
			}
			return prr_error('Invalid declaration');

		case PRS_LVALUES_MORE:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			st.state = PRS_LVALUES_TERM_DONE;
			parser_push(pr, PRS_LVALUES_TERM);
			pr.state.lvaluesPeriods = st.lvaluesPeriods;
			return parser_process(pr, flp);

		case PRS_LVALUES_DEF_TAIL:
			if (tk1.type != TOK_IDENT)
				return prr_error('Expecting identifier');
			st.state = PRS_LVALUES_DEF_TAIL_DONE;
			parser_push(pr, PRS_LOOKUP);
			pr.state.names = [tk1.ident];
			return prr_more();

		case PRS_LVALUES_DEF_TAIL_DONE:
			if (tk1.type != TOK_NEWLINE)
				return prr_error('Missing newline or semicolon');
			st = st.next; // pop *twice*
			st.lvalues.push(expr_prefix(flp, KS_PERIOD3, expr_names(flp, st.names)));
			st.next.lvalues = st.lvalues;
			pr.state = st.next;
			return parser_process(pr, flp);

		case PRS_BREAK:
			return parser_statement(pr, ast_break(flp));

		case PRS_CONTINUE:
			return parser_statement(pr, ast_continue(flp));

		case PRS_DECLARE:
			st.decls = [];
			st.state = PRS_DECLARE2;
			return parser_process(pr, flp);

		case PRS_DECLARE2:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			if (tk1.type != TOK_IDENT)
				return prr_error('Expecting identifier');
			st.state = PRS_DECLARE_LOOKUP;
			parser_push(pr, PRS_LOOKUP);
			pr.state.names = [tk1.ident];
			return prr_more();

		case PRS_DECLARE_LOOKUP:
			if (tok_isKS(tk1, KS_LPAREN)){
				st.state = PRS_DECLARE_STR;
				return prr_more();
			}
			else if (tok_isKS(tk1, KS_COMMA)){
				st.decls.push(decl_local(flp, st.names));
				st.state = PRS_DECLARE2;
				return prr_more();
			}
			st.decls.push(decl_local(flp, st.names));
			return parser_statement(pr, ast_declare(flp, st.decls));

		case PRS_DECLARE_STR:
			if (tk1.type != TOK_STR)
				return prr_error('Expecting string constant');
			st.decls.push(decl_native(flp, st.names, tk1.str));
			st.state = PRS_DECLARE_STR2;
			return prr_more();

		case PRS_DECLARE_STR2:
			if (!tok_isKS(tk1, KS_RPAREN))
				return prr_error('Expecting string constant');
			st.state = PRS_DECLARE_STR3;
			return prr_more();

		case PRS_DECLARE_STR3:
			if (tok_isKS(tk1, KS_COMMA)){
				st.state = PRS_DECLARE2;
				return prr_more();
			}
			return parser_statement(pr, ast_declare(flp, st.decls));

		case PRS_DEF:
			if (tk1.type != TOK_IDENT)
				return prr_error('Expecting identifier');
			st.state = PRS_DEF_LOOKUP;
			parser_push(pr, PRS_LOOKUP);
			pr.state.names = [tk1.ident];
			return prr_more();

		case PRS_DEF_LOOKUP:
			st.state = PRS_DEF_LVALUES;
			parser_push(pr, PRS_LVALUES);
			pr.state.lvalues = [];
			pr.state.lvaluesPeriods = 1;
			return parser_process(pr, flp);

		case PRS_DEF_LVALUES:
			st.state = PRS_DEF_BODY;
			parser_push(pr, PRS_BODY);
			pr.state.body = [];
			return parser_process(pr, flp);

		case PRS_DEF_BODY:
			if (!tok_isKS(tk1, KS_END))
				return prr_error('Missing `end` of def block');
			st.state = PRS_DEF_DONE;
			return prr_more();

		case PRS_DEF_DONE:
			return parser_statement(pr, ast_def(flp, st.names, st.lvalues, st.body));

		case PRS_DO:
			st.state = PRS_DO_BODY;
			parser_push(pr, PRS_BODY);
			pr.state.body = [];
			return parser_process(pr, flp);

		case PRS_DO_BODY:
			if (tok_isKS(tk1, KS_WHILE)){
				st.body2 = st.body;
				st.body = null;
				st.state = PRS_DO_WHILE_EXPR;
				parser_push(pr, PRS_EXPR);
				return prr_more();
			}
			else if (tok_isKS(tk1, KS_END)){
				st.state = PRS_DO_DONE;
				return prr_more();
			}
			return prr_error('Missing `while` or `end` of do block');

		case PRS_DO_DONE:
			return parser_statement(pr, ast_doEnd(flp, st.body));

		case PRS_DO_WHILE_EXPR:
			if (tk1.type != TOK_NEWLINE)
				return prr_error('Missing newline or semicolon');
			st.state = PRS_DO_WHILE_BODY;
			parser_push(pr, PRS_BODY);
			pr.state.body = [];
			return prr_more();

		case PRS_DO_WHILE_BODY:
			if (!tok_isKS(tk1, KS_END))
				return prr_error('Missing `end` of do-while block');
			st.state = PRS_DO_WHILE_DONE;
			return prr_more();

		case PRS_DO_WHILE_DONE:
			return parser_statement(pr, ast_doWhile(flp, st.body2, st.exprTerm, st.body));

		case PRS_FOR:
			if (tk1.type == TOK_NEWLINE){
				st.state = PRS_LOOP_BODY;
				parser_push(pr, PRS_BODY);
				pr.state.body = [];
				return prr_more();
			}
			st.state = PRS_FOR_VARS;
			if (tok_isKS(tk1, KS_VAR)){
				st.forVar = true;
				return prr_more();
			}
			return parser_process(pr, flp);

		case PRS_LOOP_BODY:
			if (!tok_isKS(tk1, KS_END))
				return prr_error('Missing `end` of for block');
			st.state = PRS_LOOP_DONE;
			return prr_more();

		case PRS_LOOP_DONE:
			return parser_statement(pr, ast_loop(flp, st.body));

		case PRS_FOR_VARS:
			if (tk1.type != TOK_IDENT)
				return prr_error('Expecting identifier');
			st.state = PRS_FOR_VARS_LOOKUP;
			parser_push(pr, PRS_LOOKUP);
			pr.state.names = [tk1.ident];
			return prr_more();

		case PRS_FOR_VARS_LOOKUP:
			st.names2 = st.names;
			st.names = null;
			if (tok_isKS(tk1, KS_COMMA)){
				st.state = PRS_FOR_VARS2;
				return prr_more();
			}
			else if (tok_isKS(tk1, KS_COLON)){
				st.state = PRS_FOR_VARS2_LOOKUP;
				return parser_process(pr, flp);
			}
			return prr_error('Invalid for loop');

		case PRS_FOR_VARS2:
			if (!tok_isKS(tk1, KS_IDENT))
				return prr_error('Expecting identifier');
			st.state = PRS_FOR_VARS2_LOOKUP;
			parser_push(pr, PRS_LOOKUP);
			pr.state.names = [tk1.ident];
			return prr_more();

		case PRS_FOR_VARS2_LOOKUP:
			if (!tok_isKS(tk1, KS_COLON))
				return prr_error('Expecting `:`');
			st.state = PRS_FOR_VARS_DONE;
			return prr_more();

		case PRS_FOR_VARS_DONE:
			if (tk1.type == TOK_NEWLINE)
				return prr_error('Expecting expression in for statement');
			st.state = PRS_FOR_EXPR;
			parser_push(pr, PRS_EXPR);
			return parser_process(pr, flp);

		case PRS_FOR_EXPR:
			if (tk1.type != TOK_NEWLINE)
				return prr_error('Missing newline or semicolon');
			st.state = PRS_FOR_BODY;
			parser_push(pr, PRS_BODY);
			pr.state.body = [];
			return prr_more();

		case PRS_FOR_BODY:
			if (!tok_isKS(tk1, KS_END))
				return prr_error('Missing `end` of for block');
			st.state = PRS_FOR_DONE;
			return prr_more();

		case PRS_FOR_DONE:
			return parser_statement(pr,
				ast_for(flp, st.forVar, st.names2, st.names, st.exprTerm, st.body));

		case PRS_GOTO:
			if (tk1.type != TOK_IDENT)
				return prr_error('Expecting identifier');
			st.state = PRS_GOTO_DONE;
			return prr_more();

		case PRS_GOTO_DONE:
			return parser_statement(pr, ast_goto(flp, pr.tk2.ident));

		case PRS_IF:
			if (tk1.type == TOK_NEWLINE)
				return prr_error('Missing conditional expression');
			st.state = PRS_IF_EXPR;
			st.conds = [];
			parser_push(pr, PRS_EXPR);
			return parser_process(pr, flp);

		case PRS_IF_EXPR:
			if (tk1.type != TOK_NEWLINE)
				return prr_error('Missing newline or semicolon');
			st.state = PRS_IF_BODY;
			parser_push(pr, PRS_BODY);
			pr.state.body = [];
			return prr_more();

		case PRS_IF_BODY:
			st.conds.push(cond_new(st.exprTerm, st.body));
			st.exprTerm = null;
			st.body = null;
			if (tok_isKS(tk1, KS_ELSEIF)){
				st.state = PRS_ELSEIF;
				return prr_more();
			}
			else if (tok_isKS(tk1, KS_ELSE)){
				st.state = PRS_ELSE_BODY;
				parser_push(pr, PRS_BODY);
				pr.state.body = [];
				return prr_more();
			}
			else if (tok_isKS(tk1, KS_END)){
				st.state = PRS_IF_DONE;
				return prr_more();
			}
			return prr_error('Missing `elseif`, `else`, or `end` of if block');

		case PRS_ELSEIF:
			if (tk1.type == TOK_NEWLINE)
				return prr_error('Missing conditional expression');
			st.state = PRS_IF_EXPR;
			parser_push(pr, PRS_EXPR);
			return parser_process(pr, flp);

		case PRS_IF_DONE:
			return parser_statement(pr, ast_if(flp, st.conds, []));

		case PRS_ELSE_BODY:
			if (!tok_isKS(tk1, KS_END))
				return prr_error('Missing `end` of if block');
			st.state = PRS_ELSE_DONE;
			return prr_more();

		case PRS_ELSE_DONE:
			return parser_statement(pr, ast_if(flp, st.conds, st.body));

		case PRS_INCLUDE:
			if (!tok_isKS(tk1, KS_LPAREN))
				return prr_error('Expecting file as constant string literal');
			st.state = PRS_INCLUDE_STR;
			return prr_more();

		case PRS_INCLUDE_STR:
			if (tk1.type != TOK_STR)
				return prr_error('Expecting file as constant string literal');
			st.str = tk1.str;
			st.state = PRS_INCLUDE_STR2;
			return prr_more();

		case PRS_INCLUDE_STR2:
			if (!tok_isKS(tk1, KS_RPAREN))
				return prr_error('Expecting file as constant string literal');
			st.state = PRS_INCLUDE_DONE;
			return prr_more();

		case PRS_INCLUDE_DONE:
			return parser_statement(pr, ast_include(flp, st.str));

		case PRS_NAMESPACE:
			if (tk1.type != TOK_IDENT)
				return prr_error('Expecting identifier');
			st.state = PRS_NAMESPACE_LOOKUP;
			parser_push(pr, PRS_LOOKUP);
			pr.state.names = [tk1.ident];
			return prr_more();

		case PRS_NAMESPACE_LOOKUP:
			if (tk1.type != TOK_NEWLINE)
				return prr_error('Missing newline or semicolon');
			st.state = PRS_NAMESPACE_BODY;
			parser_push(pr, PRS_BODY);
			pr.state.body = [];
			return prr_more();

		case PRS_NAMESPACE_BODY:
			if (!tok_isKS(tk1, KS_END))
				return prr_error('Missing `end` of namespace block');
			st.state = PRS_NAMESPACE_DONE;
			return prr_more();

		case PRS_NAMESPACE_DONE:
			return parser_statement(pr, ast_namespace(flp, st.names, st.body));

		case PRS_RETURN:
			if (tk1.type == TOK_NEWLINE)
				return parser_statement(pr, ast_return(flp, expr_nil(flp)));
			st.state = PRS_RETURN_DONE;
			parser_push(pr, PRS_EXPR);
			return parser_process(pr, flp);

		case PRS_RETURN_DONE:
			return parser_statement(pr, ast_return(flp, st.exprTerm));

		case PRS_USING:
			if (tk1.type == TOK_NEWLINE)
				return prr_error('Expecting identifier');
			st.namesList = [];
			st.state = PRS_USING2;
			return parser_process(pr, flp);

		case PRS_USING2:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			if (tk1.type != TOK_IDENT)
				return prr_error('Expecting identifier');
			st.state = PRS_USING_LOOKUP;
			parser_push(pr, PRS_LOOKUP);
			pr.state.names = [tk1.ident];
			return prr_more();

		case PRS_USING_LOOKUP:
			st.namesList.push(st.names);
			st.names = null;
			if (tok_isKS(tk1, KS_COMMA)){
				st.state = PRS_USING2;
				return prr_more();
			}
			return parser_statement(pr, ast_using(flp, st.namesList));

		case PRS_VAR:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			st.state = PRS_VAR_LVALUES;
			parser_push(pr, PRS_LVALUES);
			pr.state.lvalues = [];
			return parser_process(pr, flp);

		case PRS_VAR_LVALUES:
			if (st.lvalues.length <= 0)
				return prr_error('Invalid variable declaration');
			return parser_statement(pr, ast_var(flp, st.lvalues));

		case PRS_IDENTS:
			if (st.names.length == 1 && tok_isKS(tk1, KS_COLON))
				return parser_statement(pr, ast_label(flp, st.names[0]));
			pr.level++;
			st.state = PRS_EVAL_EXPR;
			parser_push(pr, PRS_EXPR_POST);
			pr.state.exprTerm = expr_names(flp, st.names);
			return parser_process(pr, flp);

		case PRS_EVAL:
			st.state = PRS_EVAL_EXPR;
			parser_push(pr, PRS_EXPR);
			return parser_process(pr, flp);

		case PRS_EVAL_EXPR:
			return parser_statement(pr, ast_eval(flp, st.exprTerm));

		case PRS_EXPR:
			if (tok_isPre(tk1)){
				st.exprPreStack = ets_new(tk1, st.exprPreStack);
				return prr_more();
			}
			st.state = PRS_EXPR_TERM;
			return parser_process(pr, flp);

		case PRS_EXPR_TERM:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			else if (tk1.type == TOK_NUM){
				st.state = PRS_EXPR_POST;
				st.exprTerm = expr_num(flp, tk1.num);
				return prr_more();
			}
			else if (tk1.type == TOK_STR){
				st.state = PRS_EXPR_POST;
				st.exprTerm = expr_str(flp, tk1.str);
				return prr_more();
			}
			else if (tk1.type == TOK_IDENT){
				st.state = PRS_EXPR_TERM_LOOKUP;
				parser_push(pr, PRS_LOOKUP);
				pr.state.names = [tk1.ident];
				return prr_more();
			}
			else if (tok_isKS(tk1, KS_LBRACE)){
				st.state = PRS_EXPR_TERM_ISEMPTYLIST;
				return prr_more();
			}
			else if (tok_isKS(tk1, KS_LPAREN)){
				st.state = PRS_EXPR_TERM_ISNIL;
				return prr_more();
			}
			return prr_error('Invalid expression');

		case PRS_EXPR_TERM_ISEMPTYLIST:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			else if (tok_isKS(tk1, KS_RBRACE)){
				st.state = PRS_EXPR_POST;
				st.exprTerm = expr_list(flp, null);
				return prr_more();
			}
			st.state = PRS_EXPR_TERM_CLOSEBRACE;
			parser_push(pr, PRS_EXPR);
			pr.state.exprAllowTrailComma = true;
			return parser_process(pr, flp);

		case PRS_EXPR_TERM_CLOSEBRACE:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			if (!tok_isKS(tk1, KS_RBRACE))
				return prr_error('Expecting close brace');
			st.exprTerm = expr_list(flp, st.exprTerm);
			st.state = PRS_EXPR_POST;
			return prr_more();

		case PRS_EXPR_TERM_ISNIL:
			if (tok_isKS(tk1, KS_RPAREN)){
				st.state = PRS_EXPR_POST;
				st.exprTerm = expr_nil(flp);
				return prr_more();
			}
			st.state = PRS_EXPR_TERM_CLOSEPAREN;
			parser_push(pr, PRS_EXPR);
			pr.state.exprAllowTrailComma = true;
			return parser_process(pr, flp);

		case PRS_EXPR_TERM_CLOSEPAREN:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			if (!tok_isKS(tk1, KS_RPAREN))
				return prr_error('Expecting close parenthesis');
			st.exprTerm = expr_paren(flp, st.exprTerm);
			st.state = PRS_EXPR_POST;
			return prr_more();

		case PRS_EXPR_TERM_LOOKUP:
			st.exprTerm = expr_names(flp, st.names);
			st.state = PRS_EXPR_POST;
			return parser_process(pr, flp);

		case PRS_EXPR_POST:
			if (tk1.type == TOK_NEWLINE){
				st.state = PRS_EXPR_FINISH;
				return parser_process(pr, flp);
			}
			else if (tok_isKS(tk1, KS_LBRACKET)){
				st.state = PRS_EXPR_INDEX_CHECK;
				return prr_more();
			}
			else if (tok_isMid(tk1, st.exprAllowComma, st.exprAllowPipe)){
				if (st.exprAllowTrailComma && tok_isKS(pr, KS_COMMA)){
					st.state = PRS_EXPR_COMMA;
					return prr_more();
				}
				st.state = PRS_EXPR_MID;
				return parser_process(pr, flp);
			}
			else if (tok_isKS(tk1, KS_RBRACE) || tok_isKS(tk1, KS_RBRACKET) ||
				tok_isKS(tk1, KS_RPAREN) || tok_isKS(tk1, KS_COLON) || tok_isKS(tk1, KS_COMMA) ||
				tok_isKS(tk1, KS_PIPE)){
				st.state = PRS_EXPR_FINISH;
				return parser_process(pr, flp);
			}
			// otherwise, this should be a call
			st.exprTerm2 = st.exprTerm;
			st.exprTerm = null;
			st.state = PRS_EXPR_POST_CALL;
			parser_push(pr, PRS_EXPR);
			pr.state.exprAllowPipe = false;
			return parser_process(pr, flp);

		case PRS_EXPR_POST_CALL:
			st.exprTerm = expr_call(flp, st.exprTerm2, st.exprTerm);
			st.exprTerm2 = null;
			st.state = PRS_EXPR_POST;
			return parser_process(pr, flp);

		case PRS_EXPR_INDEX_CHECK:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			if (tok_isKS(tk1, KS_COLON)){
				st.state = PRS_EXPR_INDEX_COLON_CHECK;
				return prr_more();
			}
			st.exprTerm2 = st.exprTerm;
			st.exprTerm = null;
			st.state = PRS_EXPR_INDEX_EXPR_CHECK;
			parser_push(pr, PRS_EXPR);
			return parser_process(pr, flp);

		case PRS_EXPR_INDEX_COLON_CHECK:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			if (tok_isKS(tk1, KS_RBRACKET)){
				st.exprTerm = expr_slice(flp, st.exprTerm, null, null);
				st.state = PRS_EXPR_POST;
				return prr_more();
			}
			st.exprTerm2 = st.exprTerm;
			st.exprTerm = null;
			st.state = PRS_EXPR_INDEX_COLON_EXPR;
			parser_push(pr, PRS_EXPR);
			return parser_process(pr, flp);

		case PRS_EXPR_INDEX_COLON_EXPR:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			if (!tok_isKS(tk1, KS_RBRACKET))
				return prr_error('Missing close bracket');
			st.exprTerm = expr_slice(flp, st.exprTerm2, null, st.exprTerm);
			st.state = PRS_EXPR_POST;
			return prr_more();

		case PRS_EXPR_INDEX_EXPR_CHECK:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			if (tok_isKS(tk1, KS_COLON)){
				st.state = PRS_EXPR_INDEX_EXPR_COLON_CHECK;
				return prr_more();
			}
			if (!tok_isKS(tk1, KS_RBRACKET))
				return prr_error('Missing close bracket');
			st.exprTerm = expr_index(flp, st.exprTerm2, st.exprTerm);
			st.exprTerm2 = null;
			st.state = PRS_EXPR_POST;
			return prr_more();

		case PRS_EXPR_INDEX_EXPR_COLON_CHECK:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			if (tok_isKS(tk1, KS_RBRACKET)){
				st.exprTerm = expr_slice(flp, st.exprTerm2, st.exprTerm, null);
				st.state = PRS_EXPR_POST;
				return prr_more();
			}
			st.exprTerm3 = st.exprTerm;
			st.exprTerm = null;
			st.state = PRS_EXPR_INDEX_EXPR_COLON_EXPR;
			parser_push(pr, PRS_EXPR);
			return parser_process(pr, flp);

		case PRS_EXPR_INDEX_EXPR_COLON_EXPR:
			if (tk1.type == TOK_NEWLINE && !tk1.soft)
				return prr_more();
			if (!tok_isKS(tk1, KS_RBRACKET))
				return prr_error('Missing close bracket');
			st.exprTerm = expr_slice(flp, st.exprTerm2, st.exprTerm3, st.exprTerm);
			st.exprTerm2 = null;
			st.exprTerm3 = null;
			st.state = PRS_EXPR_POST;
			return prr_more();

		case PRS_EXPR_COMMA:
			if (tk1.type == TOK_NEWLINE && !tk1.soft){
				parser_rev(pr); // keep the comma in tk1
				return prr_more();
			}
			if (!tok_isKS(tk1, KS_RPAREN) && !tok_isKS(tk1, KS_RBRACE)){
				st.state = PRS_EXPR_MID;
				parser_rev(pr);
				parser_process(pr, flp);
				parser_fwd(pr, pr.tkR);
				return parser_process(pr, flp);
			}
			// found a trailing comma
			st.state = PRS_EXPR_FINISH;
			return parser_process(pr, flp);

		case PRS_EXPR_MID:
			if (!tok_isMid(tk1, st.exprAllowComma, st.exprAllowPipe)){
				st.state = PRS_EXPR_FINISH;
				return parser_process(pr, flp);
			}
			while (true){
				// fight between the Pre and the Mid
				while (st.exprPreStack != null && tok_isPreBeforeMid(st.exprPreStack.tk, tk1)){
					// apply the Pre
					st.exprTerm = expr_prefix(flp, st.exprPreStack.tk.k, st.exprTerm);
					st.exprPreStack = st.exprPreStack.next;
				}

				// if we've exhaused the exprPreStack, then check against the exprMidStack
				if (st.exprPreStack == null && st.exprMidStack != null &&
					tok_isMidBeforeMid(st.exprMidStack.tk, tk1)){
					// apply the previous mMid
					var pri = parser_infix(flp, st.exprMidStack.tk.k, st.exprStack.ex, st.exprTerm)
					if (pri.type == PRI_ERROR)
						return prr_error(pri.msg);
					st.exprTerm = pri.ex;
					st.exprPreStack = st.exprPreStackStack.ets;
					st.exprPreStackStack = st.exprPreStackStack.next;
					st.exprMidStack = st.exprMidStack.next;
				}
				else // otherwise, the current Mid wins
					break;
			}
			// finally, we're safe to apply the Mid...
			// except instead of applying it, we need to schedule to apply it, in case another
			// operator takes precedence over this one
			st.exprPreStackStack = eps_new(st.exprPreStack, st.exprPreStackStack);
			st.exprPreStack = null;
			st.exprStack = exs_new(st.exprTerm, st.exprStack);
			st.exprMidStack = ets_new(tk1, st.exprMidStack);
			st.state = PRS_EXPR;
			return prr_more();

		case PRS_EXPR_FINISH:
			while (true){
				// fight between the Pre and the Mid
				while (st.exprPreStack != null &&
					(st.exprMidStack == null ||
						tok_isPreBeforeMid(st.exprPreStack.tk, st.exprMidStack.tk))){
					// apply the Pre
					st.exprTerm = expr_prefix(flp, st.exprPreStack.tk.k, st.exprTerm);
					st.exprPreStack = st.exprPreStack.next;
				}

				if (st.exprMidStack == null)
					break;

				// apply the Mid
				var pri = parser_infix(flp, st.exprMidStack.tk.k, st.exprStack.ex, st.exprTerm);
				if (pri.type == PRI_ERROR)
					return prr_error(pri.msg);
				st.exprTerm = pri.ex;
				st.exprStack = st.exprStack.next;
				st.exprPreStack = st.exprPreStackStack.ets;
				st.exprPreStackStack = st.exprPreStackStack.next;
				st.exprMidStack = st.exprMidStack.next;
			}
			// everything has been applied, and exprTerm has been set!
			st.next.exprTerm = st.exprTerm;
			pr.state = st.next;
			return parser_process(pr, flp);
	}
}

function parser_add(pr, tk, flp){
	parser_fwd(pr, tk);
	return parser_process(pr, flp);
}

//
// symbol table
//

var FVR_VAR        = 'FVR_VAR';
var FVR_TEMP_INUSE = 'FVR_TEMP_INUSE';
var FVR_TEMP_AVAIL = 'FVR_TEMP_AVAIL';

function frame_new(parent){
	return {
		vars: [FVR_VAR], // first frame variable reserved for arguments
		labels: [],
		parent: parent
	};
}

function frame_diff(parent, child){
	var fdiff = 0;
	while (child != parent && child != null){
		child = child.parent;
		fdiff++;
	}
	if (child == null)
		return -1;
	return fdiff;
}

var NSN_VAR        = 'NSN_VAR';
var NSN_CMD_LOCAL  = 'NSN_CMD_LOCAL';
var NSN_CMD_NATIVE = 'NSN_CMD_NATIVE';
var NSN_CMD_OPCODE = 'NSN_CMD_OPCODE';
var NSN_NAMESPACE  = 'NSN_NAMESPACE';

function nsname_var(name, fr, index){
	return {
		name: name,
		type: NSN_VAR,
		fr: fr,
		index: index
	};
}

function nsname_cmdLocal(name, lbl){
	return {
		name: name,
		type: NSN_CMD_LOCAL,
		lbl: lbl
	};
}

function nsname_cmdNative(name, key){
	return {
		name: name,
		type: NSN_CMD_NATIVE,
		key: key
	};
}

function nsname_cmdOpcode(name, opcode, params){
	return {
		name: name,
		type: NSN_CMD_OPCODE,
		opcode: opcode,
		params: params
	};
}

function nsname_namespace(name, ns){
	return {
		name: name,
		type: NSN_NAMESPACE,
		ns: ns
	};
}

function namespace_new(fr){
	return {
		fr: fr,
		names: []
	};
}

function scope_new(fr, parent){
	var ns = namespace_new(fr);
	return {
		ns: ns,
		nsStack: [ns],
		parent: parent
	};
}

function symtbl_new(overwrite){
	var fr = frame_new(null);
	var sc = scope_new(fr, null);
	return {
		overwrite: overwrite, // allow definitions to be overwritten?
		fr: fr,
		sc: sc
	};
}

var SFN_OK    = 'SFN_OK';
var SFN_ERROR = 'SFN_ERROR';

function sfn_ok(ns){
	return { type: SFN_OK, ns: ns };
}

function sfn_error(msg){
	return { type: SFN_ERROR, msg: msg };
}

function symtbl_findNamespace(sym, names, max){
	var ns = sym.sc.ns;
	for (var ni = 0; ni < max; ni++){
		var name = names[ni];
		var found = false;
		for (var i = 0; i < ns.names.length; i++){
			var nsn = ns.names[i];
			if (nsn.name == name){
				if (nsn.type != NSN_NAMESPACE){
					if (!sym.overwrite)
						return sfn_error('Not a namespace: "' + nsn.name + '"');
					nsn = ns.names[i] = nsname_namespace(nsn.name, namespace_new(ns.fr));
				}
				ns = nsn.ns;
				found = true;
				break;
			}
		}
		if (!found){
			var nns = namespace_new(ns.fr);
			ns.names.push(nsname_namespace(name, nns));
			ns = nns;
		}
	}
	return sfn_ok(ns);
}

var SPN_OK    = 'SPN_OK';
var SPN_ERROR = 'SPN_ERROR';

function spn_ok(){
	return { type: SPN_OK };
}

function spn_error(msg){
	return { type: SPN_ERROR, msg: msg };
}

function symtbl_pushNamespace(sym, names){
	var nsr = symtbl_findNamespace(sym, names, names.length);
	if (nsr.type == SFN_ERROR)
		return spn_error(nsr.msg);
	sym.sc.nsStack.push(nsr.ns);
	sym.sc.ns = nsr.ns;
	return spn_ok();
}

function symtbl_popNamespace(sym){
	sym.sc.nsStack.pop();
	sym.sc.ns = sym.sc.nsStack[sym.sc.nsStack.length - 1];
}

function symtbl_pushScope(sym){
	sym.sc = scope_new(sym.fr, sym.sc);
}

function symtbl_popScope(sym){
	sym.sc = sym.sc.parent;
}

function symtbl_pushFrame(sym){
	sym.fr = frame_new(sym.fr);
	symtbl_pushScope(sym);
}

function symtbl_popFrame(sym){
	symtbl_popScope(sym);
	sym.fr = sym.fr.next;
}

var STL_OK    = 'STL_OK';
var STL_ERROR = 'STL_ERROR';

function stl_ok(nsn){
	return { type: STL_OK, nsn: nsn };
}

function stl_error(msg){
	return { type: STL_ERROR, msg: msg };
}

function symtbl_lookup(sym, names){
	var trysc = sym.sc;
	while (trysc != null){
		for (var trynsi = trysc.nsStack.length - 1; trynsi >= 0; trynsi--){
			var tryns = trysc.nsStack[trynsi];
			for (var ni = 0; ni < names.length; ni++){
				var found = false;
				for (var nsni = 0; nsni < tryns.names.length; nsni++){
					var nsn = tryns.names[nsni];
					if (nsn.name == names[ni]){
						if (nsn.type == NSN_NAMESPACE){
							tryns = nsn.ns;
							found = true;
							break;
						}
						else if (ni == names.length - 1)
							return stl_ok(nsn);
						else
							break;
					}
				}
				if (!found)
					break;
			}
		}
		trysc = trysc.parent;
	}
	return stl_error('Not found: ' + names.join('.'));
}

function symtbl_addTemp(sym){
	for (var i = 0; i < sym.fr.vars.length; i++){
		if (sym.fr.vars[i] == FVR_TEMP_AVAIL){
			sym.fr.vars[i] = FVR_TEMP_INUSE;
			return varloc_new(0, i);
		}
	}
	sym.fr.vars.push(FVR_TEMP_INUSE);
	return varloc_new(0, sym.fr.vars.length - 1);
}

function symtbl_clearTemp(sym, vlc){
	if (vlc.fdiff == 0 && sym.fr.vars[vlc.index] == FVR_TEMP_INUSE)
		sym.fr.vars[vlc.index] = FVR_TEMP_AVAIL;
}

var STA_OK    = 'STA_OK';
var STA_VAR   = 'STA_VAR';
var STA_ERROR = 'STA_ERROR';

function sta_ok(){
	return { type: STA_OK };
}

function sta_var(vlc){
	return { type: STA_VAR, vlc: vlc };
}

function sta_error(msg){
	return { type: STA_ERROR, msg: msg };
}

function symtbl_addVar(sym, names){
	var nsr = symtbl_findNamespace(sym, names, names.length - 1);
	if (nsr.type == SFN_ERROR)
		return sta_error(nsr.msg);
	var ns = nsr.ns;
	for (var i = 0; i < ns.names.length; i++){
		var nsn = ns.names[i];
		if (nsn.name == names[names.length - 1]){
			if (!sym.overwrite)
				return sta_error('Cannot redefine "' + nsn.name + '"');
			if (nsn.type == NSN_VAR)
				return sta_var(varloc_new(frame_diff(nsn.fr, sym.fr), nsn.index));
			sym.fr.vars.push(FVR_VAR);
			ns.names[i] = nsname_var(nsn.name, sym.fr, sym.fr.vars.length - 1);
			return sta_var(varloc_new(0, sym.fr.vars.length - 1));
		}
	}
	sym.fr.vars.push(FVR_VAR);
	ns.names.push(nsname_var(names[names.length - 1], sym.fr, sym.fr.vars.length - 1));
	return sta_var(varloc_new(0, sym.fr.vars.length - 1));
}

function symtbl_addCmdLocal(sym, names, lbl){
	var nsr = symtbl_findNamespace(sym, names, names.length - 1);
	if (nsr.type == SFN_ERROR)
		return sta_error(nsr.msg);
	var ns = nsr.ns;
	for (var i = 0; i < ns.names.length; i++){
		var nsn = ns.names[i];
		if (nsn.name == names[names.length - 1]){
			if (!sym.overwrite)
				return sta_error('Cannot redefine "' + nsn.name + '"');
			ns.names[i] = nsname_cmdLocal(nsn.name, lbl);
			return sta_ok();
		}
	}
	ns.names.push(nsname_cmdLocal(names[names.length - 1], lbl));
	return sta_ok();
}

function symtbl_addCmdNative(sym, names, key){
	var nsr = symtbl_findNamespace(sym, names, names.length - 1);
	if (nsr.type == SFN_ERROR)
		return sta_error(nsr.msg);
	var ns = nsr.ns;
	for (var i = 0; i < ns.names.length; i++){
		var nsn = ns.names[i];
		if (nsn.name == names[names.length - 1]){
			if (!sym.overwrite)
				return sta_error('Cannot redefine "' + nsn.name + '"');
			ns.names[i] = nsname_cmdNative(nsn.name, key);
			return sta_ok();
		}
	}
	ns.names.push(nsname_cmdNative(names[names.length - 1], key));
	return sta_ok();
}

function symtbl_addCmdOpcode(sym, name, opcode, params){
	// can simplify this function because it is only called internally
	sym.sc.ns.names.push(nsname_cmdOpcode(name, opcode, params));
}

function symtbl_loadStdlib(sym){
	symtbl_addCmdOpcode(sym, 'say'        , OP_SAY         , -1);
	symtbl_addCmdOpcode(sym, 'ask'        , OP_ASK         , -1);
	symtbl_addCmdOpcode(sym, 'pick'       , -1             ,  3);
	symtbl_pushNamespace(sym, ['num']);
		symtbl_addCmdOpcode(sym, 'floor'  , OP_NUM_FLOOR   ,  1);
		symtbl_addCmdOpcode(sym, 'ceil'   , OP_NUM_CEIL    ,  1);
		symtbl_addCmdOpcode(sym, 'round'  , OP_NUM_ROUND   ,  1);
		symtbl_addCmdOpcode(sym, 'sin'    , OP_NUM_SIN     ,  1);
		symtbl_addCmdOpcode(sym, 'cos'    , OP_NUM_COS     ,  1);
		symtbl_addCmdOpcode(sym, 'tan'    , OP_NUM_TAN     ,  1);
		symtbl_addCmdOpcode(sym, 'asin'   , OP_NUM_ASIN    ,  1);
		symtbl_addCmdOpcode(sym, 'acos'   , OP_NUM_ACOS    ,  1);
		symtbl_addCmdOpcode(sym, 'atan'   , OP_NUM_ATAN    ,  1);
		symtbl_addCmdOpcode(sym, 'atan2'  , OP_NUM_ATAN2   ,  2);
		symtbl_addCmdOpcode(sym, 'log'    , OP_NUM_LOG     ,  1);
		symtbl_addCmdOpcode(sym, 'log2'   , OP_NUM_LOG2    ,  1);
		symtbl_addCmdOpcode(sym, 'log10'  , OP_NUM_LOG10   ,  1);
		symtbl_addCmdOpcode(sym, 'abs'    , OP_NUM_ABS     ,  1);
		symtbl_addCmdOpcode(sym, 'pi'     , OP_NUM_PI      ,  0);
		symtbl_addCmdOpcode(sym, 'tau'    , OP_NUM_TAU     ,  0);
		symtbl_addCmdOpcode(sym, 'lerp'   , OP_NUM_LERP    ,  3);
		symtbl_addCmdOpcode(sym, 'max'    , OP_NUM_MAX     ,  1);
		symtbl_addCmdOpcode(sym, 'min'    , OP_NUM_MIN     ,  1);
	symtbl_popNamespace(sym);
	symtbl_pushNamespace(sym, ['list']);
		symtbl_addCmdOpcode(sym, 'new'    , OP_LIST_NEW    ,  2);
		symtbl_addCmdOpcode(sym, 'find'   , OP_LIST_FIND   ,  3);
		symtbl_addCmdOpcode(sym, 'findRev', OP_LIST_FINDREV,  3);
		symtbl_addCmdOpcode(sym, 'rev'    , OP_LIST_REV    ,  1);
		symtbl_addCmdOpcode(sym, 'join'   , OP_LIST_JOIN   ,  2);
	symtbl_popNamespace(sym);
}


//
// program
//

function program_new(){
	return {
		initFrameSize: 0,
		strTable: [],
		numTable: [],
		ops: []
	};
}

var SER_OK    = 'SEP_OK';
var SER_ERROR = 'SEP_ERROR';

function ser_ok(obj, start, len){
	return { type: SER_OK, obj: obj, start: start, len: len };
}

function ser_error(msg){
	return { type: SER_ERROR, msg: msg };
}

function program_sliceEval(prg, sym, ex){
	var oe = program_eval(prg, sym, ex.obj, false);
	if (oe.type == PER_ERROR)
		return ser_error(oe.msg);
	var le;
	var iszero = false;
	if (ex.start == null){
		le = program_eval(prg, sym, expr_num(ex.flp, 0), false);
		iszero = true;
	}
	else{
		iszero = ex.start.type == EXPR_NUM && ex.start.num == 0;
		le = program_eval(prg, sym, ex.start, false);
	}
	if (le.type == PER_ERROR)
		return sep_error(le.msg);
	var re;
	if (ex.len == null){
		if (iszero){
			re = program_eval(prg, sym,
				expr_prefix(ex.flp, KS_AMP, expr_var(ex.flp, oe.vlc)));
		}
		else{
			re = program_eval(prg, sym,
				expr_infix(ex.flp, KS_MINUS,
					expr_prefix(ex.flp, KS_AMP, expr_var(ex.flp, oe.vlc)),
					expr_var(ex.flp, le.vlc)
				),
				false);
		}
	}
	else
		re = program_eval(prg, sym, ex.len, false);
	if (re.type == PER_ERROR)
		return ser_error(re.msg);
	return ser_ok(oe.vlc, le.vlc, re.vlc);
}

var PCE_OK    = 'PCE_OK';
var PCE_ERROR = 'PCE_ERROR';

function pce_ok(){
	return { type: PCE_OK };
}

function pce_error(msg){
	return { type: PCE_ERROR, msg: msg };
}

function program_callEval(prg, sym, vlc, nsn, params, flp){
	// params can be null to indicate emptiness
	switch (nsn.type){
		case NSN_CMD_LOCAL: throw 'TODO: program_callEval NSN_CMD_LOCAL';
		case NSN_CMD_NATIVE: throw 'TODO: program_callEval NSN_CMD_NATIVE';
		case NSN_CMD_OPCODE: {
			if (nsn.opcode == -1){ // pick
				throw 'TODO: pick';
			}
			if (nsn.params == -1){ // variable arguments
				var pr = program_eval(prg, sym, expr_list(flp, params));
				if (pr.type == PER_ERROR)
					return pce_error(pr.msg);
				op_param1(prg.ops, nsn.opcode, vlc, pr.vlc);
				return pce_ok();
			}
			else{
				throw 'TODO: program_callEval opcode with params: ' + nsn.params;
			}
		} break;
	}
	return pce_error('Invalid call');
}

var PIR_OK    = 'PIR_OK';
var PIR_ERROR = 'PIR_ERROR';

function pir_ok(){
	return { type: PIR_OK };
}

function pir_error(msg){
	return { type: PIR_ERROR, msg: msg };
}

function program_evalInto(prg, sym, vlc, ex){
	switch (ex.type){
		case EXPR_NIL:
			op_nil(prg.ops, vlc);
			return pir_ok();

		case EXPR_NUM: {
			if (Math.floor(ex.num) == ex.num && ex.num >= -65536 && ex.num < 65536){
				op_num(prg.ops, vlc, ex.num);
				return pir_ok();
			}
			for (var i = 0; i < prg.numTable.length; i++){
				if (prg.numTable[i] == ex.num){
					op_num_tbl(prg.ops, vlc, i);
					return pir_ok();
				}
			}
			if (prg.numTable.length >= 65535)
				return pir_error('Too many number constants');
			prg.numTable.push(ex.num);
			op_num_tbl(prg.ops, vlc, prg.numTable.length - 1);
			return pir_ok();
		} break;

		case EXPR_STR:
			throw 'TODO program_evalInto ' + ex.type;

		case EXPR_LIST: {
			op_list(prg.ops, vlc);
			if (ex.ex != null){
				if (ex.ex.type == EXPR_GROUP){
					for (var i = 0; i < ex.ex.group.length; i++){
						var pr = program_eval(prg, sym, ex.ex.group[i], true);
						if (pr.type == PER_ERROR)
							return pir_error(pr.msg);
						op_binop(prg.ops, OP_PUSH, vlc, vlc, pr.vlc);
					}
				}
				else{
					var pr = program_eval(prg, sym, ex.ex, true);
					if (pr.type == PER_ERROR)
						return pir_error(pr.msg);
					op_binop(prg.ops, OP_PUSH, vlc, vlc, pr.vlc);
				}
			}
			return pir_ok();
		} break;

		case EXPR_NAMES: {
			var sl = symtbl_lookup(sym, ex.names);
			if (sl.type == STL_ERROR)
				return pir_error(sl.msg);
			switch (sl.nsn.type){
				case NSN_VAR: {
					var fdiff = frame_diff(sl.nsn.fr, sym.fr);
					if (fdiff != vlc.fdiff || sl.nsn.index != vlc.index)
						op_move(prg.ops, vlc, varloc_new(fdiff, sl.nsn.index));
					return pir_ok();
				} break;
				case NSN_CMD_LOCAL:
				case NSN_CMD_NATIVE:
				case NSN_CMD_OPCODE: {
					var pe = program_callEval(prg, sym, vlc, sl.nsn, null, ex.flp);
					if (pe.type == PCE_ERROR)
						return pir_error(pe.msg);
					return pir_ok();
				} break;
				case NSN_NAMESPACE:
					return pir_error('Invalid expression');
			}
			throw new Error('Unknown NSN type: ' + sl.nsn.type);
		} break;

		case EXPR_VAR: {
			if (ex.vlc.fdiff != vlc.fdiff || ex.vlc.index != vlc.index)
				op_move(prg.ops, vlc, ex.vlc);
			return pir_ok();
		} break;

		case EXPR_PAREN:
			return program_evalInto(prg, sym, vlc, ex.ex);

		case EXPR_GROUP:
			for (var i = 0; i < ex.group.length; i++){
				if (i == ex.group.length - 1)
					return program_evalInto(prg, sym, vlc, ex.group[i]);
				var pr = program_evalEmpty(prg, sym, ex.group[i], true);
				if (pr.type == PEM_ERROR)
					return pir_error(pr.msg);
			}
			break;

		case EXPR_PREFIX: {
			var unop = ks_toUnaryOp(ex.k);
			if (unop < 0)
				return pir_error('Invalid unary operator');
			var ee = program_eval(prg, sym, ex.ex, false);
			if (ee.type == PER_ERROR)
				return pir_error(ee.msg);
			op_unop(prg.ops, unop, vlc, ee.vlc);
			symtbl_clearTemp(sym, ee.vlc);
			return pir_ok();
		} break;

		case EXPR_INFIX: {
			var binop = ks_toBinaryOp(ex.k);
			if (binop >= 0){
				var le = program_eval(prg, sym, ex.left, false);
				if (le.type == PER_ERROR)
					return pir_error(le.msg);
				var re = program_eval(prg, sym, ex.right, false);
				if (re.type == PER_ERROR)
					return pir_error(re.msg);
				op_binop(prg.ops, binop, vlc, le.vlc, re.vlc);
				symtbl_clearTemp(sym, le.vlc);
				symtbl_clearTemp(sym, re.vlc);
				return pir_ok();
			}

			var mutop = ks_toMutateOp(ex.k);
			if (ex.k == KS_EQU || mutop >= 0){
				var lp = lval_prepare(prg, sym, ex.left);
				if (lp.type == LVP_ERROR)
					return pir_error(lp.msg);
				var lv = lp.lv;
				switch (lv.type){
					case LVR_VAR: {
						if (ex.k == KS_EQU){
							var pr = program_evalInto(prg, sym, lv.vlc, ex.right);
							if (pr.type == PIR_ERROR)
								return pr;
						}
						else{
							var pr = program_eval(prg, sym, ex.right, true);
							if (pr.type == PER_ERROR)
								return pir_error(pr.msg);
							op_binop(prg.ops, mutop, lv.vlc, lv.vlc, pr.vlc);
						}
						if (vlc.fdiff != lv.vlc.fdiff || vlc.index != lv.vlc.index)
							op_move(prg.ops, vlc, lv.vlc);
						return pir_ok();
					} break;
					case LVR_INDEX: // TODO: clear out temps inside lvr
					case LVR_SLICE: // TODO: clear out temps inside lvr
					case LVR_LIST:
						throw 'TODO: program_evalInto EXPR_INFIX ' + lv.type;
				}
			}

			if (ex.k == KS_AMP2){
				throw 'TODO: infix AND';
			}
			else if (ex.k == KS_PIPE2){
				throw 'TODO: infix OR';
			}
			else if (ex.k == KS_AMP2EQU){
				throw 'TODO: AND equal';
			}
			else if (ex.k == KS_PIPE2EQU){
				throw 'TODO: PIPE equal';
			}

			return pir_error('Invalid operation');
		} break;

		case EXPR_CALL: {
			if (ex.cmd.type != EXPR_NAMES)
				return pir_error('Invalid call');
			var sl = symtbl_lookup(sym, ex.cmd.names);
			if (sl.type == STL_ERROR)
				return pir_error(sl.msg);
			var pe = program_callEval(prg, sym, vlc, sl.nsn, ex.params, ex.flp);
			if (pe.type == PCE_ERROR)
				return pir_error(pe.msg);
			return pir_ok();
		} break;

		case EXPR_INDEX: {
			var oe = program_eval(prg, sym, ex.obj, false);
			if (oe.type == PER_ERROR)
				return pir_error(oe.msg);
			var ke = program_eval(prg, sym, ex.key, false);
			if (ke.type == PER_ERROR)
				return pir_error(ke.msg);
			op_getat(prg.ops, vlc, oe.vlc, ke.vlc);
			symtbl_clearTemp(sym, oe.vlc);
			symtbl_clearTemp(sym, ke.vlc);
			return pir_ok();
		} break;

		case EXPR_SLICE: {
			var se = program_sliceEval(prg, sym, ex);
			if (se.type == SER_ERROR)
				return pir_error(se.msg);
			op_slice(prg.ops, vlc, se.obj, se.start, se.len);
			symtbl_clearTemp(sym, se.obj);
			symtbl_clearTemp(sym, se.start);
			symtbl_clearTemp(sym, se.len);
			return pir_ok();
		} break;
	}
	throw 'failed to return value for program_evalInto ' + ex.type;
}

var PER_OK    = 'PER_OK';
var PER_ERROR = 'PER_ERROR';

function per_ok(vlc){
	return { type: PER_OK, vlc: vlc };
}

function per_error(msg){
	return { type: PER_ERROR, msg: msg };
}

var LVR_VAR    = 'LVR_VAR';
var LVR_INDEX  = 'LVR_INDEX';
var LVR_SLICE  = 'LVR_SLICE';
var LVR_LIST   = 'LVR_LIST';

function lvr_var(vlc){
	return { type: LVR_VAR, vlc: vlc };
}

function lvr_index(obj, key){
	return { type: LVR_INDEX, obj: obj, key: key };
}

function lvr_slice(obj, start, len){
	return { type: LVR_SLICE, obj: obj, start: start, len: len };
}

function lvr_list(body, rest){
	return { type: LVR_LIST, body: body, rest: rest };
}

var LVP_OK    = 'LVP_OK';
var LVP_ERROR = 'LVP_ERROR';

function lvp_ok(lv){
	return { type: LVP_OK, lv: lv };
}

function lvp_error(msg){
	return { type: LVP_ERROR, msg: msg };
}

function lval_prepare(prg, sym, ex){
	switch (ex.type){
		case EXPR_NAMES: {
			var sl = symtbl_lookup(sym, ex.names);
			if (sl.type == STL_ERROR)
				return lvp_error(sl.msg);
			if (sl.nsn.type != NSN_VAR)
				return lvp_error('Invalid assignment');
			return lvp_ok(lvr_var(varloc_new(frame_diff(sl.nsn.fr, sym.fr), sl.nsn.index)));
		} break;

		case EXPR_INDEX: {
			var oe = program_eval(prg, sym, ex.obj, false);
			if (oe.type == PER_ERROR)
				return lvp_error(oe.msg);
			var ke = program_eval(prg, sym, ex.key, false);
			if (ke.type == PER_ERROR)
				return lvp_error(ke.msg);
			return lvp_ok(lvr_index(oe.vlc, ke.vlc));
		} break;

		case EXPR_SLICE: {
			var se = program_sliceEval(prg, sym, ex);
			if (se.type == SER_ERROR)
				return lvp_error(se.msg);
			return lvp_ok(lvr_slice(se.obj, se.start, se.len));
		} break;

		case EXPR_LIST: {
			if (ex.ex == null)
				return lvp_error('Invalid assignment');
			var body = [];
			var rest = null;
			if (ex.ex.type == EXPR_GROUP){
				for (var i = 0; i < ex.ex.group.length; i++){
					var gex = ex.ex.group[i];
					if (i == ex.ex.group.length - 1 && gex.type == EXPR_PREFIX &&
						gex.k == KS_PERIOD3){
						var lp = lval_prepare(prg, sym, gex.ex);
						if (lp.type == LVP_ERROR)
							return lp;
						rest = lp.lv;
					}
					else{
						var lp = lval_prepare(prg, sym, gex);
						if (lp.type == LVP_ERROR)
							return lp;
						body.push(lp.lv);
					}
				}
			}
			else{
				if (ex.ex.type == EXPR_PREFIX && ex.ex.k == KS_PERIOD3){
					var lp = lval_prepare(prg, sym, ex.ex.ex);
					if (lp.type == LVP_ERROR)
						return lp;
					rest = lp.lv;
				}
				else{
					var lp = lval_prepare(prg, sym, ex.ex);
					if (lp.type == LVP_ERROR)
						return lp;
					body.push(lp.lv);
				}
			}
			return lvp_ok(lvr_list(body, rest));
		} break;

		default:
			throw 'TODO: lval_prepare ' + ex.type;
	}
	return lvp_error('Invalid assignment');
}

function program_eval(prg, sym, ex, autoclear){
	if (ex.type == EXPR_INFIX){
		var mutop = ks_toMutateOp(ex.k);
		if (ex.k == KS_EQU || mutop >= 0){
			var lp = lval_prepare(prg, sym, ex.left);
			if (lp.type == LVP_ERROR)
				return per_error(lp.msg);
			var lv = lp.lv;
			switch (lv.type){
				case LVR_VAR: {
					if (ex.k == KS_EQU){
						var pr = program_evalInto(prg, sym, lv.vlc, ex.right);
						if (pr.type == PIR_ERROR)
							return per_error(pr.msg);
						return per_ok(lv.vlc);
					}
					var pr = program_eval(prg, sym, ex.right, true);
					if (pr.type == PER_ERROR)
						return pr;
					op_binop(prg.ops, mutop, lv.vlc, lv.vlc, pr.vlc);
					return per_ok(lv.vlc);
				} break;
				case LVR_INDEX: // TODO: clear out temps inside lvr
				case LVR_SLICE: // TODO: clear out temps inside lvr
				case LVR_LIST:
					throw 'TODO: program_eval ' + lv.type;
			}
			throw new Error('Unknown lvalue type: ' + lv.type);
		}

		if (ex.k == KS_AMP2EQU){
			throw 'TODO: program_eval AND equal';
		}
		else if (ex.k == KS_PIPE2EQU){
			throw 'TODO: program_Eval PIPE equal';
		}
	}
	else if (ex.type == EXPR_NAMES){
		var sl = symtbl_lookup(sym, ex.names);
		if (sl.type == STL_ERROR)
			return per_error(sl.msg);
		if (sl.nsn.type == NSN_VAR)
			return per_ok(varloc_new(frame_diff(sl.nsn.fr, sym.fr), sl.nsn.index));
		// otherwise, fall through and evaluate the results into a temp
	}
	else if (ex.type == EXPR_VAR)
		return per_ok(ex.vlc);
	var tmp = symtbl_addTemp(sym);
	if (autoclear)
		symtbl_clearTemp(sym, tmp);
	var pr = program_evalInto(prg, sym, tmp, ex);
	if (pr.type == PIR_ERROR)
		return per_error(pr.msg);
	return per_ok(tmp);
}

var PEM_OK    = 'PEM_OK';
var PEM_ERROR = 'PEM_ERROR';

function pem_ok(){
	return { type: PEM_OK };
}

function pem_error(msg){
	return { type: PEM_ERROR, msg: msg };
}

function program_evalEmpty(prg, sym, ex){
	if (ex.type == EXPR_NIL || ex.type == EXPR_NUM || ex.type == EXPR_STR || ex.type == EXPR_VAR)
		return pem_ok();
	else if (ex.type == EXPR_NAMES){
		var sl = symtbl_lookup(sym, ex.names);
		if (sl.type == STL_ERROR)
			return pem_error(sl.msg);
		return pem_ok();
	}
	var pr = program_eval(prg, sym, ex, true);
	if (pr.type == PER_ERROR)
		return pem_error(pr.msg);
	return pem_ok();
}

var LVA_OK    = 'LV_OK';
var LVA_ERROR = 'LV_ERROR';

function lva_ok(){
	return { type: LVA_OK };
}

function lva_error(msg){
	return { type: LVA_ERROR, msg: msg };
}

function lval_addVars(sym, ex){
	switch (ex.type){
		case EXPR_NAMES: {
			var sr = symtbl_addVar(sym, ex.names);
			if (sr.type == STA_ERROR)
				return lva_error(sr.msg);
			return lva_ok();
		} break;
		case EXPR_LIST:
			if (ex.ex == null)
				return lva_error('Invalid assignment');
			return lval_addVars(sym, ex.ex);
		case EXPR_GROUP:
			for (var i = 0; i < ex.group.length; i++){
				var sr = lval_addVars(sym, ex.group[i]);
				if (sr.type == STA_ERROR)
					return lva_error(sr.msg);
			}
			return lva_ok();
		case EXPR_PREFIX:
			if (ex.k == KS_PERIOD3)
				return lval_addVars(sym, ex.ex);
			break;
	}
	return lva_error('Invalid assignment');
}

var PGR_OK    = 'PGR_OK';
var PGR_ERROR = 'PGR_ERROR';

function pgr_ok(){
	return { type: PGR_OK };
}

function pgr_error(msg){
	return { type: PGR_ERROR, msg: msg };
}

function program_gen(prg, sym, stmt){
	switch (stmt.type){
		case AST_BREAK:
			throw 'TODO program_gen' + stmt.type;
		case AST_CONTINUE:
			throw 'TODO program_gen' + stmt.type;
		case AST_DECLARE:
			throw 'TODO program_gen' + stmt.type;
		case AST_DEF:
			throw 'TODO program_gen' + stmt.type;
		case AST_DO_END:
			throw 'TODO program_gen' + stmt.type;
		case AST_DO_WHILE:
			throw 'TODO program_gen' + stmt.type;
		case AST_FOR:
			throw 'TODO program_gen' + stmt.type;
		case AST_LOOP:
			throw 'TODO program_gen' + stmt.type;
		case AST_GOTO:
			throw 'TODO program_gen' + stmt.type;
		case AST_IF:
			throw 'TODO program_gen' + stmt.type;
		case AST_INCLUDE:
			throw 'TODO program_gen' + stmt.type;
		case AST_NAMESPACE:
			throw 'TODO program_gen' + stmt.type;
		case AST_RETURN:
			throw 'TODO program_gen' + stmt.type;
		case AST_USING:
			throw 'TODO program_gen' + stmt.type;
		case AST_VAR:
			for (var i = 0; i < stmt.lvalues.length; i++){
				var ex = stmt.lvalues[i];
				if (ex.type == EXPR_INFIX){
					var lr = lval_addVars(sym, ex.left);
					if (lr.type == LVA_ERROR)
						return pgr_error(lr.msg);
					if (ex.right != null){
						var pr = program_eval(prg, sym, ex, true);
						if (pr.type == PER_ERROR)
							return pgr_error(pr.msg);
					}
				}
				else
					throw 'TODO: don\'t know how to AST_VAR the expression ' + ex.type;
			}
			return pgr_ok();
		case AST_EVAL: {
			var pr = program_eval(prg, sym, stmt.ex, true);
			if (pr.type == PER_ERROR)
				return pgr_error(pr.msg);
			return pgr_ok();
		} break;
		case AST_LABEL:
			throw 'TODO program_gen' + stmt.type;
	}
}

//
// context
//

function context_new(prg){
	return {
		prg: prg,
		callStack: [],
		lexStack: [new Array(prg.initFrameSize)],
		lexIndex: 0,
		pc: 0
	};
}

var CRR_DONE   = 'CRR_DONE';
var CRR_PAUSED = 'CRR_PAUSED';
var CRR_ERROR  = 'CRR_ERROR';

function context_run(ctx){
	throw 'TODO: execute';
}

//
// compiler
//

var UTF8 = require('./utf8');

function comppr_new(flp, tks){
	return { flp: flp, tks: tks };
}

function compiler_new(repl){
	var sym = symtbl_new(repl);
	symtbl_loadStdlib(sym);
	return {
		pr: parser_new(),
		file: null,
		repl: repl,
		prg: program_new(),
		sym: sym
	};
}

function compiler_processTokens(cmp, cmpr, err){
	for (var c = 0; c < cmpr.length; c++){
		var flp = cmpr[c].flp;
		var tks = cmpr[c].tks;
		for (var i = 0; i < tks.length; i++){
			var tk = tks[i];
			if (tk.type == TOK_ERROR){
				err[0] = filepos_err(flp, tk.msg);
				return false;
			}
			var res = parser_add(cmp.pr, tk, flp);
			if (res.type == PRR_MORE)
				continue;
			else if (res.type == PRR_ERROR){
				err[0] = filepos_err(flp, res.msg);
				cmp.pr = parser_new(); // reset the parser
				return false;
			}

			console.log(JSON.stringify(res.stmt, null, '  '));
			var pr = program_gen(cmp.prg, cmp.sym, res.stmt);
			if (pr.type == PGR_ERROR)
				console.log('Error:', pr.msg);
		}
	}
	return true;
}

function compiler_pushFile(cmp, file){
	cmp.file = {
		flp: filepos_new(file, 1, 1),
		lastret: false,
		lx: lex_new(),
		next: cmp.file
	};
}

function compiler_popFile(cmp, err){
	var tks = [];
	lex_close(cmp.lx, tks);
	var cmpr = [comppr_new(cmp.flp, tks)];
	var res = compiler_processTokens(cmp, cmpr, err);
	cmp.file = cmp.file.next;
	return res;
}

function compiler_add(cmp, str, err){
	return compiler_addBytes(cmp, UTF8.encode(str), err);
}

function compiler_addBytes(cmp, bytes, err){
	var cmpr = [];
	for (var i = 0; i < bytes.length; i++){
		var flp = filepos_newCopy(cmp.file.flp);

		var ch = String.fromCharCode(bytes[i]);

		// calculate future line/chr
		if (ch == '\r'){
			cmp.file.lastret = true;
			cmp.file.flp.line++;
			cmp.file.flp.chr = 1;
		}
		else{
			if (ch == '\n'){
				if (!cmp.file.lastret){
					cmp.file.flp.line++;
					cmp.file.flp.chr = 1;
				}
			}
			else
				cmp.file.flp.chr++;
			cmp.file.lastret = false;
		}

		var tks = [];
		lex_add(cmp.file.lx, ch, tks);
		cmpr.push(comppr_new(flp, tks));
	}
	return compiler_processTokens(cmp, cmpr, err);
}

function compiler_level(cmp){
	return cmp.pr.level;
}

//
// JavaScript API
//

module.exports = {
	repl: function(){
		var cmp = compiler_new(true);
		compiler_pushFile(cmp, null);
		return {
			add: function(str){
				var err = [null];
				if (compiler_add(cmp, str, err) == false)
					return err[0];
				return false;
			},
			level: function(){
				return compiler_level(cmp);
			}
		};
	}
};