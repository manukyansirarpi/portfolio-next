'use client';

import * as React from 'react';
import { apiRoutes, authenticatedPostRequest } from '@/utils/api';
import { CircularProgress, Divider, Paper } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { FileArrowUp as FileArrowUpIcon } from '@phosphor-icons/react/dist/ssr/FileArrowUp';
import { toast } from 'sonner';

import { createClient as createSupabaseClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import BasePage from '@/components/page/base-page';
import { FileIcon } from '@/components/uploader/file-icon';

import { FileDropzone } from './file-dropzone';

export function Uploader({ setShowUploader }) {
  const [files, setFiles] = React.useState([]);
  const [disableGenerateButton, setDisableGenerateButton] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const supabase = createSupabaseClient();
  const { user } = useUser();

  React.useEffect(() => {
    if (user) {
      setFiles([]);
    }
  }, [user]);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  async function fetchSelectedBrandId() {
    const { data } = await supabase
      .from('brands')
      .select('*')
      .eq('organization_id', user?.organizationId)
      .eq('is_selected', true);
    return data[0].id;
  }

  const handleDrop = React.useCallback(async (newFiles) => {
    const brandId = await fetchSelectedBrandId();
    newFiles.forEach((file) => {
      const filePath = `${user?.organizationId}/${brandId}/product/${file.name}`;
      const response = supabase.storage
        .from('documents') // Replace with your actual bucket name
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
        });
      response
        .then((data) => {
          if (data.error) {
            file.error = data.error.error.toLowerCase();
          } else {
            file.uploaded = true;
            setDisableGenerateButton(false);
          }
        })
        .finally(() => {
          setFiles((prevFiles) => {
            return [...prevFiles, ...[file]];
          });
        });
    });
  }, []);

  const handleRemoveAll = React.useCallback(() => {
    setFiles([]);
  }, []);

  const handleClose = () => {
    setShowUploader(false);
  };

  const handleGenerateEvent = async () => {
    setLoading(true);
    const brandId = await fetchSelectedBrandId();
    const documents = [];
    files.forEach((file) => {
      documents.push(`${user?.organizationId}/${brandId}/product/${file.name}`);
    });

    const response = await authenticatedPostRequest(apiRoutes.events.generate, { documents });

    if (response.status === 201) {
      toast.success('Genereren productbeschrijvingen gestart');
      handleClose();
    } else {
      toast.error('Er is iets mis gegaan, probeer het later opnieuw');
    }
    setLoading(false);
  };

  return (
    <Stack direction="row" spacing={0.2}>
      <Box
        sx={{
          flexGrow: 2,
          flexBasis: files.length ? '0%' : '100%',
        }}
      >
        <BasePage
          subtitle="Upload bestanden om productbeschrijvingen te genereren of bij te werken."
          title="Productbeschrijvingen"
        >
          <Stack
            spacing={2}
            sx={{
              border: '1px dashed #3E33CF',
              borderRadius: '4px',
              margin: '15px',
              height: '95vh',
              justifyContent: 'center',
            }}
          >
            <Stack justifyContent="center" spacing={5} sx={{ alignItems: 'center' }}>
              <Avatar
                sx={{
                  borderRadius: '4px',
                  '--Avatar-size': '64px',
                  '--Icon-fontSize': '40px',
                  bgcolor: 'var(--mui-palette-action-hover)',
                  boxShadow: 'var(--mui-shadows-8)',
                  color: 'var(--mui-palette-text-primary)',
                }}
              >
                <FileArrowUpIcon fontSize="var(--Icon-fontSize)" />
              </Avatar>
              <Typography sx={{ fontSize: '20px' }} variant="h5">
                Upload je bestanden
              </Typography>
            </Stack>
            <Stack sx={{ alignItems: 'center' }}>
              <Typography color="text.secondary" variant="body2">
                Sleep of upload PDF, DOC of XLS product
              </Typography>
              <Typography color="text.secondary" variant="body2">
                bestanden met een maximum grootte van 20MB{' '}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                om productbeschrijvingen te genereren.
              </Typography>
            </Stack>
            <FileDropzone accept={{ '*/*': [] }} files={files} onDrop={handleDrop} />
          </Stack>
        </BasePage>
      </Box>
      <Box
        sx={{
          flexGrow: 1, // 2/3 of the available space
          flexBasis: '0%', // Necessary to let flexGrow control width
        }}
      >
        {files.length ? (
          <BasePage subtitle="" title="Bestanden uploaden">
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Stack alignItems="center" direction="column" marginTop={2} marginX={2} spacing={2}>
                {files.map((file, index) => {
                  return (
                    <Paper
                      elevation={2}
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 1,
                        borderRadius: '10px',
                        width: '100%',
                      }}
                    >
                      {/* PDF Icon */}
                      <Box alignItems="center" display="flex" justifyContent="center" sx={{ paddingRight: 2 }}>
                        <FileIcon extension={file.name.split('.').pop()} />
                      </Box>

                      {/* File Name */}
                      <Box flexGrow={1} sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2">{file.name}</Typography>
                      </Box>

                      {/* Checkmark Icon */}
                      <Tooltip
                        arrow
                        placement="left-start"
                        title={file.uploaded ? 'Geüpload' : 'Bestand met deze naam bestaat al!'}
                      >
                        <Box alignItems="center" display="flex" justifyContent="center" sx={{ paddingLeft: 2 }}>
                          <IconButton disabled sx={{ color: 'green' }}>
                            <img
                              alt="icon"
                              height="30"
                              src={file.uploaded ? '/assets/icon-check.svg' : '/assets/icon-warning.svg'}
                              width="30"
                            />
                          </IconButton>
                        </Box>
                      </Tooltip>
                    </Paper>
                  );
                })}
              </Stack>
              <Divider />
              <Stack
                direction="row"
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingY: 3,
                  paddingX: 3,
                  position: 'sticky',
                  bottom: 0,
                  backgroundColor: 'white',
                  zIndex: 1,
                }}
              >
                <Button color="secondary" onClick={handleRemoveAll} size="small" type="button" variant="outlined">
                  Annuleren
                </Button>
                <Button
                  disabled={disableGenerateButton || loading}
                  onClick={handleGenerateEvent}
                  size="small"
                  startIcon={<img alt="spark" height="16" src="/assets/icon-spark.svg" width="16" />} // Adjust size as necessary
                  type="button"
                  variant="contained"
                >
                  Genereren
                  {loading ? <CircularProgress color="inherit" size="1rem" sx={{ marginLeft: 1 }} /> : null}
                </Button>
              </Stack>
            </Stack>
          </BasePage>
        ) : null}
      </Box>
    </Stack>
  );
}
