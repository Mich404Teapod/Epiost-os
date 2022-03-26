;==========================================
; Bootloader.asm
; A Simple Bootloader
;==========================================
bits 16
start: jmp boot

;; constant and variable definitions
msg	db	"Welcome to Epiost Operating System", 0ah, 0dh, 0h

boot:
  cli	; no interrupts
  cld	; all that we need to init

  mov		ax, 50h

  ; ;; set the buffer
	mov	es, ax
	xor	bx, bx

  mov	al, 17
	mov	ch, 0
	mov	cl, 2
	mov	dh, 0
	mov	dl, 0

  mov	ah, 0x02
	int	0x13					      ; call BIOS - Read the sector
  jmp	[500h + 0x18]				; jump and execute the sector!

  hlt	; halt the system

  ; We have to be 512 bytes. Clear the rest of the bytes with 0
  times 510 - ($-$$) db 0
  dw 0xAA55				  ; Boot Signiture
