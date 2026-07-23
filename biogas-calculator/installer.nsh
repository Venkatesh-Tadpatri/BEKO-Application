!macro customInstall
  CreateDirectory "$INSTDIR\Reports"
  ; Program Files is read-only to standard user accounts even though this
  ; (elevated) installer can write to it - grant the Users group write
  ; access to the Reports subfolder so the app can save into it at runtime.
  nsExec::Exec 'icacls "$INSTDIR\Reports" /grant *S-1-5-32-545:(OI)(CI)M'
!macroend
